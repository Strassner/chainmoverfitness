import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { meaningFor, apiBase, scoreForBodyFat } from '@/components/PudgeScorePage'
import { narrativeOnly, readResults } from '@/components/BucketPage'

describe('meaningFor (the /pudgescore result blurb)', () => {
  it('returns a non-empty string across the whole body-fat range', () => {
    for (let bf = 0; bf <= 60; bf++) {
      const s = meaningFor(bf)
      expect(typeof s, `bf ${bf}`).toBe('string')
      expect(s.length, `bf ${bf}`).toBeGreaterThan(20)
    }
  })

  it('changes band at each documented boundary', () => {
    for (const edge of [12, 17, 22, 29, 39]) {
      expect(meaningFor(edge), `boundary ${edge}`).not.toBe(meaningFor(edge + 1))
    }
  })

  it('is stable inside a band', () => {
    expect(meaningFor(13)).toBe(meaningFor(17))
    expect(meaningFor(23)).toBe(meaningFor(29))
  })

  it('leads on health rather than appearance at the top of the range', () => {
    expect(meaningFor(45)).toMatch(/health markers/i)
  })
})

describe('apiBase', () => {
  const setHost = (hostname) => {
    // jsdom's location is read-only; replace the whole object for the test.
    delete window.location
    window.location = { hostname }
  }
  const original = window.location

  afterEach(() => { window.location = original })

  it('targets the local Worker when served from localhost', () => {
    setHost('localhost')
    expect(apiBase()).toBe('http://127.0.0.1:8787')
    setHost('127.0.0.1')
    expect(apiBase()).toBe('http://127.0.0.1:8787')
  })

  it('targets the deployed Worker everywhere else', () => {
    setHost('lukestrassner.com')
    expect(apiBase()).toBe('https://pudge-score.chainmover.workers.dev')
    setHost('www.lukestrassner.com')
    expect(apiBase()).toBe('https://pudge-score.chainmover.workers.dev')
  })

  it('is a function, not a value frozen at import time', () => {
    // If this ever becomes a const again, the static build breaks: there is
    // no window when the page is prerendered.
    expect(typeof apiBase).toBe('function')
  })
})

describe('narrativeOnly', () => {
  it('drops the Path Forward, guarantee and step-by-step sections', () => {
    const md = [
      '### 01. Where you are',
      'Some narrative.',
      '### 05. The Path Forward',
      'Structured steps live in React now.',
      '### The Chainmover Guarantee',
      'Guarantee copy.',
      'Watch the step by step overview',
    ].join('\n\n---\n\n')

    const out = narrativeOnly(md)
    expect(out).toMatch(/Where you are/)
    expect(out).not.toMatch(/The Path Forward/)
    expect(out).not.toMatch(/Chainmover Guarantee/)
    expect(out).not.toMatch(/step by step overview/i)
  })

  it('leaves markdown with none of those sections untouched', () => {
    const md = '### Only section\n\n---\n\nSecond block'
    expect(narrativeOnly(md)).toMatch(/Only section/)
    expect(narrativeOnly(md)).toMatch(/Second block/)
  })

  it('matches the numbered heading with or without a leading zero', () => {
    expect(narrativeOnly('### 5. The Path Forward')).not.toMatch(/Path Forward/)
    expect(narrativeOnly('### 05. The Path Forward')).not.toMatch(/Path Forward/)
  })
})

describe('readResults (the quiz -> bucket page bridge)', () => {
  beforeEach(() => sessionStorage.clear())

  it('returns null when the quiz has not been taken', () => {
    expect(readResults('early')).toBeNull()
  })

  it('returns the stored report when the bucket matches', () => {
    const report = { bucket: 'stress', macros: { calories: 2400 }, flags: [] }
    sessionStorage.setItem('chainmover_results', JSON.stringify(report))
    expect(readResults('stress')).toMatchObject({ bucket: 'stress' })
  })

  it('refuses a report from a different bucket', () => {
    // Someone hand-typing /high after scoring "early" must not see early data.
    sessionStorage.setItem('chainmover_results', JSON.stringify({ bucket: 'early' }))
    expect(readResults('high')).toBeNull()
  })

  it('survives corrupted storage instead of throwing', () => {
    sessionStorage.setItem('chainmover_results', 'not json{')
    expect(readResults('early')).toBeNull()
  })
})

describe('scoreForBodyFat (the /pudgescore number and meter)', () => {
  it('scores lean low and heavy high — it is not a grade out of 10', () => {
    expect(scoreForBodyFat(10, 14)).toBeLessThanOrEqual(2)
    expect(scoreForBodyFat(28, 34)).toBeGreaterThanOrEqual(7)
  })

  it('never drops below 1 or above 10', () => {
    expect(scoreForBodyFat(3, 7)).toBe(1)
    expect(scoreForBodyFat(55, 65)).toBe(10)
  })

  it('rises monotonically with body fat', () => {
    const ranges = [[6, 10], [11, 15], [15, 19], [19, 23], [24, 28], [28, 34], [34, 40], [42, 48]]
    const scores = ranges.map(([lo, hi]) => scoreForBodyFat(lo, hi))
    for (let i = 1; i < scores.length; i += 1) {
      expect(scores[i], `${ranges[i]} vs ${ranges[i - 1]}`).toBeGreaterThanOrEqual(scores[i - 1])
    }
    expect(scores[scores.length - 1]).toBeGreaterThan(scores[0])
  })
})
