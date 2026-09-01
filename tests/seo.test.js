import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'

/* The whole point of moving off the SPA was that every route ships real HTML
   with its own metadata. These tests guard that at the source level, so a new
   page can't be added without a title, a description and a canonical. */

const APP = 'src/app'

function routeDirs(dir = APP, base = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (!e.isDirectory() || e.name.startsWith('_') || e.name.startsWith('(')) return []
    const here = path.join(dir, e.name)
    const route = `${base}/${e.name}`
    const self = fs.existsSync(path.join(here, 'page.jsx')) ? [route] : []
    return [...self, ...routeDirs(here, route)]
  })
}

const ROUTES = ['/', ...routeDirs()]
const pageFile = (r) => path.join(APP, r === '/' ? '' : r.slice(1), 'page.jsx')
const source = (r) => fs.readFileSync(pageFile(r), 'utf8')

describe('route inventory', () => {
  it('finds every expected page and no unexpected ones', () => {
    expect([...ROUTES].sort()).toEqual([
      '/', '/apply', '/bodycomp', '/booked', '/carbs', '/early', '/high',
      '/insulin', '/kit', '/landing', '/metabolic', '/pudgescore', '/quiz',
      '/sleep', '/stress', '/visceralfat',
    ])
  })

  it('no longer serves /buy', () => {
    expect(fs.existsSync(path.join(APP, 'buy'))).toBe(false)
    expect(fs.existsSync('src/components/BuyPage.jsx')).toBe(false)
  })
})

describe('page metadata', () => {
  it.each(ROUTES)('%s exports metadata with a description', (route) => {
    const s = source(route)
    expect(s).toMatch(/export const metadata = \{/)
    expect(s).toMatch(/description:\s*["']/)
  })

  it.each(ROUTES)('%s declares a canonical matching its own path', (route) => {
    const m = source(route).match(/canonical:\s*["']([^"']+)["']/)
    expect(m, `no canonical in ${pageFile(route)}`).toBeTruthy()
    expect(m[1]).toBe(route)
  })

  it('gives every route except the home page its own title', () => {
    // Home inherits the layout default; the rest set their own.
    for (const route of ROUTES.filter((r) => r !== '/')) {
      expect(source(route), `${route} has no title`).toMatch(/title:\s*["']/)
    }
  })

  it('keeps descriptions inside a length search results will show', () => {
    for (const route of ROUTES) {
      const d = source(route).match(/description:\s*["'](.+?)["'],\s*$/m)
      expect(d, route).toBeTruthy()
      expect(d[1].length, `${route} description is ${d[1].length} chars`).toBeLessThanOrEqual(200)
      expect(d[1].length, `${route} description is only ${d[1].length} chars`).toBeGreaterThan(40)
    }
  })

  it('marks the post-call confirmation page noindex', () => {
    expect(source('/booked')).toMatch(/robots:\s*\{\s*index:\s*false/)
  })
})

describe('sitemap', () => {
  const entries = sitemap()
  const urls = entries.map((e) => e.url)

  it('uses the live domain', () => {
    for (const u of urls) expect(u.startsWith('https://lukestrassner.com/')).toBe(true)
  })

  it('ends every URL in a slash, matching trailingSlash canonicals', () => {
    // next.config.mjs sets trailingSlash: true. A sitemap entry without the
    // slash points at a redirect rather than at the canonical page.
    for (const u of urls) expect(u.endsWith('/'), u).toBe(true)
  })

  it('contains no duplicates', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('lists only routes that actually exist', () => {
    for (const u of urls) {
      const route = new URL(u).pathname.replace(/\/$/, '') || '/'
      expect(ROUTES, `sitemap lists ${route}, which has no page`).toContain(route)
    }
  })

  it('excludes noindex routes', () => {
    for (const u of urls) expect(u).not.toMatch(/\/booked\//)
  })

  it('includes every indexable route', () => {
    const listed = new Set(urls.map((u) => new URL(u).pathname.replace(/\/$/, '') || '/'))
    const noindex = ROUTES.filter((r) => /robots:\s*\{\s*index:\s*false/.test(source(r)))
    for (const r of ROUTES) {
      if (noindex.includes(r)) continue
      expect(listed.has(r), `${r} is indexable but missing from the sitemap`).toBe(true)
    }
  })

  it('gives the home page top priority', () => {
    const home = entries.find((e) => e.url === 'https://lukestrassner.com/')
    expect(home.priority).toBe(1.0)
    for (const e of entries) expect(e.priority).toBeLessThanOrEqual(home.priority)
  })
})

describe('robots', () => {
  const r = robots()

  it('allows crawling and points at the sitemap', () => {
    expect(r.rules.allow).toBe('/')
    expect(r.sitemap).toBe('https://lukestrassner.com/sitemap.xml')
  })

  it('disallows exactly the noindex routes', () => {
    expect(r.rules.disallow).toEqual(['/booked/'])
  })

  it('does not disallow anything that is in the sitemap', () => {
    const listed = sitemap().map((e) => new URL(e.url).pathname)
    for (const d of r.rules.disallow) expect(listed).not.toContain(d)
  })
})
