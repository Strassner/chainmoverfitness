/**
 * Lead capture API — Cloudflare Worker.
 *
 * The site is static on GitHub Pages and cannot hold a secret. This is the
 * piece that can: the systeme.io key lives in Worker secrets and never reaches
 * a browser.
 *
 * One job now. The photo analysis that used to live here was retired when the
 * Gemini Gem took over that work — /bodycomp captures the email, then hands the
 * visitor to Google.
 */

import { setApiBase, subscribe } from './systeme';
import { Limiter } from './ratelimiter';

export { RateLimiter } from './ratelimiter';

export interface Env {
  LIMITER: DurableObjectNamespace;
  SYSTEME_API_KEY: string;
  ALLOWED_ORIGIN: string;
  /** Test seam only — points the systeme.io calls at a stub. Unset in production. */
  SYSTEME_BASE_URL?: string;
}

/**
 * Deliberately generous, because IP is a poor proxy for "person" on the traffic
 * this page gets. Instagram traffic is overwhelmingly mobile, and mobile
 * carriers put many subscribers behind one shared address (CGNAT) — so a tight
 * per-IP cap locks out real leads who have never visited before. A gym or an
 * office on one connection has the same problem.
 *
 * Nothing here costs money per request, so the only thing this protects is junk
 * in the mailing list, and systeme.io's own deliverability validation already
 * rejects most of that. Erring toward letting real people through.
 */
const LEADS_PER_IP_PER_HOUR = 30;

const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const allowed = allowedOrigins(env);

    // A browser would block the response anyway; rejecting outright also stops
    // another site pushing junk into the list through its visitors' browsers.
    if (origin !== null && !allowed.includes(origin)) {
      return new Response('Not allowed', { status: 403 });
    }

    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/healthz') {
      return json({ ok: true }, 200, cors);
    }

    if (request.method === 'POST' && url.pathname === '/api/lead') {
      return handleLead(request, env, cors);
    }

    return json({ error: 'Not found.' }, 404, cors);
  }
} satisfies ExportedHandler<Env>;

// --- endpoint --------------------------------------------------------------

async function handleLead(
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Enter a valid email address.' }, 400, cors);
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!looksLikeEmail(email)) {
    return json({ error: 'Enter a valid email address.' }, 400, cors);
  }

  const ip = clientIp(request);
  const limiter = new Limiter(env.LIMITER);

  const verdict = await limiter.acquire(`lead:${ip}`, LEADS_PER_IP_PER_HOUR);
  if (!verdict.ok) {
    // Logged so a "why was I blocked?" report can be answered from the logs
    // instead of guesswork.
    console.warn(
      `rate limited ${ip}: ${verdict.used}/${verdict.limit} used, ${verdict.minutesLeft}m left in window`
    );
    return json({ error: 'Too many submissions. Try again later.' }, 429, cors);
  }

  if (!env.SYSTEME_API_KEY) {
    console.error('SYSTEME_API_KEY is not set — the lead was not captured');
    return json({ ok: false }, 202, cors);
  }

  setApiBase(env.SYSTEME_BASE_URL);
  const result = await subscribe(email, env.SYSTEME_API_KEY);

  // systeme.io checks deliverability, not just syntax, so a typo or a mailbox
  // that doesn't exist lands here. That is fixable by the visitor, so tell them
  // rather than waving them through to the Gem and losing the lead.
  if (result === 'invalid-email') {
    return json({ error: 'That email address was rejected. Check it and try again.' }, 400, cors);
  }

  // 202 when systeme.io failed for any other reason. The page still lets them
  // through — someone who handed over an email should get what they were
  // promised even if the list provider is having a bad day.
  return result === 'ok' ? json({ ok: true }, 200, cors) : json({ ok: false }, 202, cors);
}

// --- helpers ---------------------------------------------------------------

function allowedOrigins(env: Env): string[] {
  const configured = (env.ALLOWED_ORIGIN || 'https://lukestrassner.com')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return [...new Set([...configured, ...DEV_ORIGINS])];
}

function corsHeaders(origin: string | null): Record<string, string> {
  if (origin === null) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

/** Set by Cloudflare's edge and not spoofable, unlike X-Forwarded-For. */
function clientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

function looksLikeEmail(email: string): boolean {
  if (!email || email.length > 254 || /\s/.test(email)) return false;

  const at = email.indexOf('@');
  if (at < 1 || at === email.length - 1) return false;

  const domain = email.slice(at + 1);
  return domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.');
}

function json(payload: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', ...cors }
  });
}
