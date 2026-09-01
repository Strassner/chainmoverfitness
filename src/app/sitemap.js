export const dynamic = 'force-static'

const BASE = 'https://lukestrassner.com'

/* Indexable routes only — /booked is noindex. Priority reflects how
   much of the funnel each page carries, not how much we like it. */
const ROUTES = [
  ['/', 1.0],
  ['/landing', 0.9],
  ['/metabolic', 0.9],
  ['/quiz', 0.8],
  ['/insulin', 0.8],
  ['/visceralfat', 0.8],
  ['/carbs', 0.8],
  ['/sleep', 0.8],
  ['/pudgescore', 0.7],
  ['/bodycomp', 0.7],
  ['/kit', 0.7],
  ['/apply', 0.6],
  ['/early', 0.5],
  ['/stress', 0.5],
  ['/high', 0.5],
]

export default function sitemap() {
  return ROUTES.map(([route, priority]) => ({
    /* trailingSlash is on in next.config.mjs, so the canonical form of every
       URL ends in a slash. The sitemap has to agree with it or each entry
       points at a redirect. */
    url: `${BASE}${route.endsWith('/') ? route : route + '/'}`,
    changeFrequency: 'monthly',
    priority,
  }))
}
