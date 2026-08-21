/**
 * Durable Object holding the rate-limit counters.
 *
 * A Durable Object is a single instance that every request talks to, so the
 * counts are exact — no eventual consistency, no lost writes, and no locking
 * needed because it processes one thing at a time.
 *
 * Cloudflare's other storage option (KV) allows 1,000 writes a day on the free
 * plan, which would mean the limiter quietly stopped counting during exactly
 * the flood it exists to stop.
 */

const HOUR_MS = 60 * 60 * 1000;

interface Window {
  used: number;
  endsAt: number;
}

export interface LimitVerdict {
  ok: boolean;
  used: number;
  limit: number;
  minutesLeft: number;
}

export class RateLimiter implements DurableObject {
  constructor(private readonly ctx: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const { key, limit } = (await request.json()) as { key: string; limit: number };
    return Response.json(await this.acquire(key, limit));
  }

  /** Reports used/limit alongside the verdict — a bare false gives you nothing
   *  to diagnose with when someone says they were blocked unfairly. */
  private async acquire(key: string, limit: number): Promise<LimitVerdict> {
    const now = Date.now();

    const stored = await this.ctx.storage.get<Window>(key);
    const window: Window =
      stored && stored.endsAt > now ? stored : { used: 0, endsAt: now + HOUR_MS };

    const minutesLeft = Math.ceil((window.endsAt - now) / 60_000);

    if (window.used >= limit) return { ok: false, used: window.used, limit, minutesLeft };

    window.used++;
    await this.ctx.storage.put(key, window);
    return { ok: true, used: window.used, limit, minutesLeft };
  }
}

/** Client-side helper so the Worker never has to know the DO wire format. */
export class Limiter {
  private readonly stub: DurableObjectStub;

  constructor(namespace: DurableObjectNamespace) {
    // One instance for everything. At this volume there is nothing to shard.
    this.stub = namespace.get(namespace.idFromName('v1'));
  }

  async acquire(key: string, limit: number): Promise<LimitVerdict> {
    const response = await this.stub.fetch('https://limiter/', {
      method: 'POST',
      body: JSON.stringify({ key, limit })
    });
    return (await response.json()) as LimitVerdict;
  }
}
