# Chainmover Coaching — lukestrassner.com

The marketing site: Next.js App Router, rendered to static HTML at build time,
served by GitHub Pages. The only server-side code is the Cloudflare Worker in
[`worker/`](worker/README.md), which holds the API keys `/pudgescore` and
`/bodycomp` need.

## Why it renders on the server

It used to be a Vite single-page app. Every URL served the same near-empty
`index.html` and let React fill it in, and deep links went through a
`404.html` redirect trampoline to get there. A crawler asking for
`/insulin` got an empty div and a redirect, so none of the long-form pages
could rank.

Now `next build` writes a real HTML file per route. `out/insulin/index.html`
contains the whole article, its own `<title>`, its own meta description, and a
canonical link. React still takes over in the browser for the parts that need
it — the quiz, the photo tools, the forms — but nothing depends on JavaScript
running for the content to exist.

`output: 'export'` in [`next.config.mjs`](next.config.mjs) is what makes this
work on GitHub Pages: no Node process is involved at any point, just files.

## Running it

```bash
npm run dev
```

That serves <http://localhost:3000> with hot reload.

```bash
npm run build
```

That writes the whole site to `out/`. Open any file in there to see exactly
what a crawler gets.

To work on `/pudgescore` or `/bodycomp` you also need the Worker running, since
those two pages call it:

```bash
npm --prefix worker run dev
```

Both pages point at `http://127.0.0.1:8787` when opened from localhost and at
the deployed Worker otherwise, so nothing needs switching by hand.

## Tests

```bash
npm test
```

Vitest, no browser needed. `npm run test:watch` reruns on save.

Five files under `tests/`:

| file | what it protects |
| --- | --- |
| `quiz-scoring.test.js` | Which bucket a lead lands in, and the macro numbers on their results page. Pins every score boundary. |
| `validation.test.js` | The application form and the `/bodycomp` email gate — the two places a lead can be lost to a bad error message. |
| `seo.test.js` | Every route has a title, description and correct canonical; the sitemap matches the routes that exist and agrees with `trailingSlash`. |
| `content-policy.test.js` | No price outside `/kit`, no manufactured scarcity, no unguarded placeholders, nothing read from `window` or storage during render. |
| `page-helpers.test.js` | `apiBase`, the quiz→results sessionStorage bridge, and the `/pudgescore` result bands. |

Two of these encode standing decisions rather than mechanics, and will fail on
purpose if the decision is reversed without meaning to:

- **`content-policy`** — price and scarcity copy are banned sitewide (`/kit`
  excepted). If a price needs to come back, change the test in the same commit.
- **`content-policy`** — nothing may read `sessionStorage`, `window` or
  `document` at module scope or inside a `useState` initialiser. Both patterns
  break the static build or hydration; both have already happened once.

## Deploying

```bash
npm run deploy
```

That builds and pushes `out/` to the `gh-pages` branch. The `-t` flag matters:
it tells `gh-pages` to include dotfiles, which is how `.nojekyll` gets there.
Without that file GitHub runs the output through Jekyll, and Jekyll skips every
directory starting with an underscore — including `_next/`, which is all the
CSS and JavaScript.

`public/CNAME` keeps the custom domain attached across deploys.

## Layout

```
src/app/          one directory per URL; each page.jsx sets its own metadata
src/components/   the page components themselves
src/assets/       images, imported directly so they get content-hashed names
public/           files copied verbatim: CNAME, .nojekyll, logos
worker/           Cloudflare Worker — see its own README
apps-script/      Google Apps Script backend for the quiz and application form
```

### Server and client components

Most pages are server components: they render once at build time and ship no
JavaScript of their own. The ones marked `'use client'` at the top do need the
browser — `QuizPage`, `ApplicationPage`, `BuyPage`, `BodyCompPage`,
`PudgeScorePage`, `BucketPage`, `InsulinPage`, `LandingPage`.

A page only needs `'use client'` if it uses state, effects, event handlers, or
MUI. `YouTubeThumb` exists as its own client component for exactly this reason:
three otherwise-static pages need one `onError` handler for the YouTube
thumbnail fallback, and isolating it there keeps those pages on the server.

Note that being a client component does **not** make a page uncrawlable. Every
route is still prerendered to HTML at build time — `'use client'` only decides
whether interactive JavaScript is also shipped for it.

### Adding a page

Make `src/app/<route>/page.jsx`:

```jsx
import Thing from '@/components/Thing'

export const metadata = {
  title: 'Whatever it is',
  description: 'One sentence that would make sense as a search result.',
  alternates: { canonical: '/route' },
}

export default function Page() {
  return <Thing />
}
```

Then add it to [`src/app/sitemap.js`](src/app/sitemap.js), or it won't be
submitted to Google. Pages that shouldn't be indexed — checkout, confirmation
screens — get `robots: { index: false, follow: true }` in their metadata and
stay out of the sitemap.

## SEO

- Per-route `<title>` and meta description, set in each `page.jsx`.
- Canonical URLs on every page. `trailingSlash: true` is on, so the canonical
  form always ends in a slash and `sitemap.js` matches it.
- `sitemap.xml` and `robots.txt` are generated at build time from
  [`src/app/sitemap.js`](src/app/sitemap.js) and
  [`src/app/robots.js`](src/app/robots.js).
- `/buy` and `/booked` are `noindex` — they're conversion steps, not content.
- Fonts load from a `<link>` in [`src/app/layout.jsx`](src/app/layout.jsx)
  rather than being injected by an effect after hydration, so text renders in
  the right face on first paint.
