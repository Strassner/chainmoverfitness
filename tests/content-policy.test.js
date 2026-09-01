import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/* Two standing decisions about what this site is allowed to say:

   1. No price anywhere. The money conversation happens after the
      application, not before it.
   2. No manufactured scarcity — no "N spots left", no countdowns.

   /kit is the one exception: it is a separate $27 product with its own
   Gumroad checkout, and its whole page is built around the price tag.

   These tests fail loudly if either creeps back in. */

const EXEMPT = new Set(['KitPage.jsx'])

const componentFiles = fs
  .readdirSync('src/components')
  .filter((f) => f.endsWith('.jsx'))

const readComponent = (f) => fs.readFileSync(path.join('src/components', f), 'utf8')

/* Only look at text a visitor could read: strip comments, so an explanatory
   note about why the price is gone doesn't trip the test it explains. */
function visibleText(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, ' ')
}

describe('no price outside /kit', () => {
  const under = componentFiles.filter((f) => !EXEMPT.has(f))

  it.each(under)('%s contains no dollar amount', (f) => {
    const found = visibleText(readComponent(f)).match(/\$\s?\d[\d,.]*/g) || []
    expect(found, `${f} mentions ${found.join(', ')}`).toEqual([])
  })

  it.each(under)('%s contains no cost or pricing question', (f) => {
    const text = visibleText(readComponent(f))
    const banned = [
      /how much (is it|does (it|the coaching) cost)/i,
      /\bmy pricing\b/i,
      /\bcost more than\b/i,
      /billed at/i,
      /one-time payment of/i,
      /\ba month, cancel anytime\b/i,
    ]
    for (const re of banned) {
      expect(re.test(text), `${f} matches ${re}`).toBe(false)
    }
  })

  it('/kit is the only file allowed to quote a price', () => {
    const kit = visibleText(readComponent('KitPage.jsx'))
    expect(kit).toMatch(/\$27/)
  })
})

describe('no manufactured scarcity', () => {
  it.each(componentFiles)('%s makes no limited-availability claim', (f) => {
    const text = visibleText(readComponent(f))
    const banned = [
      /\d+\s*(spots?|slots?|seats?|places?)\s*(open|left|remaining|available)/i,
      /only\s+\d+\s+(spots?|slots?|seats?)/i,
      /spots? open each month/i,
      /clients at a time/i,
      /closing (soon|tonight|friday)/i,
      /doors close/i,
    ]
    for (const re of banned) {
      expect(re.test(text), `${f} matches ${re}`).toBe(false)
    }
  })
})

describe('no leftover build scaffolding', () => {
  /* A PASTE_ placeholder is allowed to exist — some integrations are wired up
     later — but it must never be able to reach a visitor. Every one has to be
     guarded by a startsWith('PASTE_') check before it is used. */
  /* A PASTE_ placeholder may exist — some videos and integrations get wired up
     later — but it must never reach a visitor. Two guard idioms are in use:
     `X.startsWith('PASTE_')` for URLs, and `X === 'PASTE_…'` for the video
     embeds, which swap in a "not recorded yet" tile. Either is fine; none is
     not. */
  it('guards every PASTE_ placeholder before use', () => {
    for (const f of componentFiles) {
      const source = readComponent(f)
      for (const [, name] of source.matchAll(/const (\w+) = '(PASTE_[A-Z_]+)'/g)) {
        const guarded =
          new RegExp(`${name}\\.startsWith\\('PASTE_'\\)`).test(source) ||
          new RegExp(`${name} === 'PASTE_`).test(source)
        expect(guarded, `${f}: ${name} is an unguarded placeholder`).toBe(true)
      }
    }
  })

  it('keeps the two Apps Script endpoints in sync', () => {
    // The quiz and the application form post to the same sheet; a mismatch
    // silently splits the leads across two places.
    const grab = (f) => readComponent(f).match(/const APPS_SCRIPT_URL = '([^']+)'/)?.[1]
    expect(grab('QuizPage.jsx')).toBeTruthy()
    expect(grab('ApplicationPage.jsx')).toBe(grab('QuizPage.jsx'))
  })

  it('imports nothing from react-router', () => {
    for (const f of componentFiles) {
      expect(readComponent(f), f).not.toMatch(/react-router/)
    }
  })

  /* Every page is prerendered to static HTML at build time. Anything that
     reads browser-only state *during render* makes the first client render
     disagree with that HTML, and React throws the tree away and rebuilds it.
     Storage has to be read from an effect, after mount. */
  it('reads no browser storage inside a useState initialiser', () => {
    for (const f of componentFiles) {
      const source = readComponent(f)
      const bad = [...source.matchAll(/useState\((?:\(\)\s*=>)?[^)]*\)/g)]
        .map((m) => m[0])
        .filter((s) => /sessionStorage|localStorage|window\.|document\./.test(s))
      expect(bad, `${f}: ${bad.join(' ; ')}`).toEqual([])
    }
  })

  it('reads no browser global at module scope', () => {
    // Anything evaluated at import time also runs during the static build,
    // where there is no window. This is what broke /pudgescore and /bodycomp
    // on the first build after the migration.
    for (const f of componentFiles) {
      const topLevel = readComponent(f)
        .split('\n')
        .filter((l) => /^(const|let|var)\s/.test(l))
        .join('\n')
      expect(topLevel, `${f} touches window at module scope`)
        .not.toMatch(/\b(window|document|sessionStorage|localStorage|navigator)\./)
    }
  })
})
