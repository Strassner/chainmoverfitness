/**
 * Adds the lead to systeme.io. Nothing is stored on our side — systeme.io is
 * the record.
 *
 * This deliberately mirrors syncSysteme_ in apps-script/application-notifier.gs
 * so both entry points behave the same way against the same account: email is
 * the unique key, a repeat submission updates rather than duplicates, and
 * tagging is best-effort because being on the list matters and a missing tag
 * does not.
 */

const DEFAULT_API = 'https://api.systeme.io/api';

/** Overridable so the calls can be pointed at a stub for testing. Unset in production. */
let API = DEFAULT_API;
export function setApiBase(base: string | undefined) {
  API = base && base.length > 0 ? base : DEFAULT_API;
}

/** Tag name -> id. Per-isolate and short-lived, which is enough to keep the
 *  /tags lookup off most requests. */
const tagIdCache = new Map<string, number>();

/**
 * Tags applied to every lead from this Worker.
 *
 * Currently just the generic site tag — no funnel-specific tag, as asked.
 * The trade-off is that /bodycomp signups are indistinguishable from any other
 * website lead in systeme.io, so this funnel's conversion rate can't be read
 * separately. To change that, add a tag here and redeploy — systeme.io creates
 * one the first time it is used.
 */
const TAGS = ['source-website'];

/**
 * `invalid-email` is separated from `failed` on purpose. systeme.io validates
 * deliverability, not just syntax, so a plain typo ("gmial.com", a mailbox that
 * doesn't exist) comes back rejected. That is the visitor's mistake and they
 * can fix it — but only if we tell them. Lumping it in with our own outages
 * would wave them through to the Gem and lose the lead silently.
 */
export type SubscribeResult = 'ok' | 'invalid-email' | 'failed';

export async function subscribe(email: string, apiKey: string): Promise<SubscribeResult> {
  const contact = await getOrCreateContact(email, apiKey);

  if ('error' in contact) {
    console.warn('systeme.io contact failed:', contact.detail);
    return contact.error;
  }

  const contactId = contact.id;

  // Best effort from here. They are on the list, which is the part that counts.
  for (const name of TAGS) {
    try {
      const id = await getOrCreateTag(name, apiKey);
      if (id === null) continue;

      const res = await call(`/contacts/${contactId}/tags`, 'POST', apiKey, { tagId: id });
      if (res.code >= 300) console.warn(`systeme.io tag "${name}" failed:`, res.code);
    } catch (err) {
      console.warn(`systeme.io tag "${name}" failed`, String(err));
    }
  }

  return 'ok';
}

type ContactLookup = { id: number } | { error: 'invalid-email' | 'failed'; detail: string };

/**
 * systeme.io treats email as unique, so creating an existing contact fails and
 * we look them up instead — that path is normal, not an error.
 */
async function getOrCreateContact(email: string, apiKey: string): Promise<ContactLookup> {
  const res = await call('/contacts', 'POST', apiKey, { email });

  if (res.code < 300) {
    const created = parse(res.text);
    if (created?.id) return { id: created.id as number };
  }

  const found = items(
    (await call(`/contacts?email=${encodeURIComponent(email)}`, 'GET', apiKey)).text
  );
  if (found.length && found[0]?.id) return { id: found[0].id as number };

  // Keep the body, not just the status. A bare "422" says a field was rejected
  // but not which one, which makes this impossible to diagnose from logs alone.
  // The response body never contains the API key — that travels in a request
  // header — so this is safe to log.
  const detail = `${res.code}: ${res.text.slice(0, 400)}`;

  return { error: rejectedTheAddress(res) ? 'invalid-email' : 'failed', detail };
}

/**
 * True when systeme.io turned the address itself down. It validates
 * deliverability, so this fires on typos and on mailboxes that don't exist —
 * both of which the visitor can correct.
 */
function rejectedTheAddress(res: { code: number; text: string }): boolean {
  if (res.code !== 422) return false;

  const body = parse(res.text);
  const violations = Array.isArray(body?.violations) ? body.violations : [];

  return violations.some((v: any) => v?.propertyPath === 'email');
}

async function getOrCreateTag(name: string, apiKey: string): Promise<number | null> {
  const cached = tagIdCache.get(name);
  if (cached !== undefined) return cached;

  const existing = items((await call('/tags', 'GET', apiKey)).text);
  let id: number | null = null;

  for (const tag of existing) {
    if (tag?.name === name) {
      id = tag.id;
      break;
    }
  }

  if (id === null) {
    const made = await call('/tags', 'POST', apiKey, { name });
    if (made.code >= 300) {
      console.warn(`systeme.io could not create tag "${name}":`, made.code);
      return null;
    }
    id = parse(made.text)?.id ?? null;
  }

  if (id !== null) tagIdCache.set(name, id);
  return id;
}

// --- transport -------------------------------------------------------------

async function call(
  path: string,
  method: 'GET' | 'POST',
  apiKey: string,
  payload?: unknown
): Promise<{ code: number; text: string }> {
  try {
    const res = await fetch(API + path, {
      method,
      headers: { 'X-API-Key': apiKey, 'content-type': 'application/json' },
      body: payload === undefined ? undefined : JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000)
    });
    return { code: res.status, text: await res.text() };
  } catch (err) {
    console.warn('systeme.io call failed', String(err));
    return { code: 0, text: '' };
  }
}

function parse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** List endpoints have changed shape before — accept every form of them. */
function items(text: string): any[] {
  const j = parse(text);
  if (!j) return [];
  if (Array.isArray(j)) return j;
  return j.items ?? j['hydra:member'] ?? [];
}
