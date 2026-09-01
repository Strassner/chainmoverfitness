/**
 * Payload validation. All of this runs before a token is spent.
 *
 * The declared media type is attacker-controlled, so it is treated as a claim
 * to be checked against the actual leading bytes, not as fact.
 */

export const ALLOWED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type MediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** ~5MB once decoded. Checked before allocating anything. */
export const MAX_BASE64_CHARS = 7_200_000;

export function isAllowedMediaType(value: unknown): value is MediaType {
  return typeof value === 'string' && (ALLOWED_MEDIA_TYPES as readonly string[]).includes(value);
}

/** Strips whitespace and confirms the string is really base64. */
export function normaliseBase64(input: string): string | null {
  const cleaned = input.replace(/\s+/g, '');
  if (cleaned.length === 0 || cleaned.length % 4 !== 0) return null;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleaned)) return null;
  return cleaned;
}

/**
 * Decoded size without decoding. A 5MB image is ~6.8MB of base64 and there is
 * no reason to allocate that just to measure it.
 */
export function decodedByteLength(base64: string): number {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return (base64.length / 4) * 3 - padding;
}

/** Decodes only the header — enough for a magic-number check. */
function leadingBytes(base64: string, count: number): Uint8Array {
  const chars = Math.ceil(count / 3) * 4; // 4 base64 chars per 3 bytes
  const binary = atob(base64.slice(0, chars));
  const out = new Uint8Array(Math.min(count, binary.length));
  for (let i = 0; i < out.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export function matchesDeclaredType(base64: string, mediaType: MediaType): boolean {
  let b: Uint8Array;
  try {
    b = leadingBytes(base64, 12);
  } catch {
    return false; // not decodable
  }

  switch (mediaType) {
    case 'image/jpeg':
      return b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;

    case 'image/png':
      return (
        b.length >= 8 &&
        b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
        b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
      );

    // RIFF....WEBP — four size bytes sit between the two tags.
    case 'image/webp':
      return (
        b.length >= 12 &&
        b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
        b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
      );
  }
}
