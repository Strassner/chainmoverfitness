# Pudge Score API — Cloudflare Worker

The server half of `/pudgescore` and `/bodycomp`. It exists because the site is
static on GitHub Pages, and static hosting can't keep a secret — anything you
put in the page, a visitor can read. Both API keys live here instead.

Two jobs: analyse a physique photo with Claude Haiku 4.5, and put an email
address into systeme.io. No photo is ever stored — it exists in memory for one
request and is gone.

> The Worker is still **named** `pudge-score` in `wrangler.toml`. That's
> deliberate — renaming it would change the `workers.dev` URL, and that URL is
> baked into `/bodycomp`. Ignore the name; it's just an address now.

## What Cloudflare is here

**A Worker** is a small program Cloudflare runs for you. No server, nothing to
patch or restart, no cold start. One command ships it.

**A Durable Object** is a small piece of memory that survives between requests.
This one holds the rate-limit counter so nobody can spam your mailing list.
Cloudflare's other storage option (KV) allows only 1,000 writes a day on the
free plan, which would mean the limiter quietly stopped counting during exactly
the flood it exists to stop.

**Secrets** are your Anthropic and systeme.io API keys. Set once by command,
encrypted, never in a file, never sent to a browser.

**A `workers.dev` URL** is the free public HTTPS address the page calls:
`https://pudge-score.chainmover.workers.dev`.

## Endpoints

| Method | Path               | Purpose                                     |
| ------ | ------------------ | ------------------------------------------- |
| `POST` | `/api/pudge-score` | Photo in, body fat estimate + score out      |
| `POST` | `/api/lead`        | Email in, systeme.io contact out             |
| `GET`  | `/healthz`         | Uptime check                                 |

### `POST /api/pudge-score`

Takes `{ "imageBase64": "...", "mediaType": "image/jpeg" }` and returns
`{ bfLow, bfHigh, pudgeScore, headline, explanation, markers }`.

`pudgeScore: 0` is the refusal shape — not a person, a minor, or explicit. The
page renders that as a "try another photo" state rather than an error.

Failures: `400` bad or non-image payload, `413` over 5MB decoded, `429` rate
limited, `502` upstream failure or output that didn't survive validation. A
`502` never carries any part of the Anthropic response.

**Response shape is enforced by structured outputs**, not by asking the model
nicely — no assistant prefill, no "return only JSON" instruction, no
brace-matching extractor. If the model returns something that doesn't fit the
schema, the SDK reports it and we return a 502 rather than rendering nonsense
as though it were real.

`POST /api/lead` takes `{ "email": "..." }` and returns:

- `200 {"ok":true}` — captured
- `202 {"ok":false}` — systeme.io didn't take it, but we have the address. The
  page lets them through to the Gem anyway; someone who handed over an email
  should get what they were promised even if the list provider is having a bad
  day. This shows up as an error in the logs, not to the visitor.
- `400` — not a valid email address. Two causes: it failed our own syntax check
  (no API call made), or systeme.io rejected it. systeme.io validates
  **deliverability**, not just syntax — it turns down typo'd domains with no MX
  record and mailboxes that don't exist. That's the visitor's mistake and they
  can fix it, so the page shows an inline error and lets them retry rather than
  waving them through to the Gem with the lead lost.
- `429` — more than 10 submissions from one IP in an hour

## Setup

From `worker/`:

```bash
npm install
```

```bash
npx wrangler login
```

```bash
npx wrangler deploy
```

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

```bash
npx wrangler secret put SYSTEME_API_KEY
```

The Anthropic key comes from [console.anthropic.com](https://console.anthropic.com)
→ API keys, and the account needs credit on it. The systeme.io key is the same
kind the application form already uses: profile picture → Settings → Public API
keys → Create. It's shown once.

Check what's stored with `npx wrangler secret list` — names only, never values.

## Changing things later

```bash
npx wrangler deploy
```

That's the whole deploy. Seconds, no downtime. `npm run logs` tails it live.
`npm run dev` runs it locally on `http://127.0.0.1:8787`, which is what
`/bodycomp` targets when opened from localhost; local secrets go in
`worker/.dev.vars`, which is gitignored.

## Tagging

Every lead gets `source-website`, matching the tag your Apps Script already
applies. There is **no funnel-specific tag** — that was the call for now.

The trade-off: `/bodycomp` signups are indistinguishable from any other website
lead inside systeme.io, so this funnel's conversion rate can't be read on its
own. To change that, add a tag to `TAGS` in [`src/systeme.ts`](src/systeme.ts)
and redeploy. systeme.io creates a tag the first time it's used, so nothing
needs setting up on that end first.

## Costs

**Cloudflare: nothing.** The free plan covers 100,000 requests a day.

**Anthropic: about a third of a cent per analysis.** Claude Haiku 4.5 is $1 per
million input tokens and $5 per million output. A 1024px photo is ~1,100 tokens,
the system prompt ~600, the reply ~200 — so roughly $0.0027 a go, or about $2.70
per thousand leads.

Two windows cap the damage if someone tries to burn your credit: 5 analyses per
IP per hour, and 200 globally per hour. That ceiling is about $0.60/hour, or $14
across a full day of sustained abuse. Lower `GLOBAL_ANALYSES_PER_HOUR` in
[`src/index.ts`](src/index.ts) if that worst case bothers you.

Refusals and our own failures refund the personal window — a photo the model
wouldn't read gave the visitor nothing, so it shouldn't cost them one of their
five. The global ceiling is never refunded, because a refusal still spent a
token.

## What is never stored

Nothing is written on our side. systeme.io holds the lead; there is no database.
