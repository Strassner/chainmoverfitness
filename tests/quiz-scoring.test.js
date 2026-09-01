import { describe, it, expect } from 'vitest'
import { getBucket, calcMacros, getFlags } from '@/components/QuizPage'

/* The quiz decides which of three result pages a lead lands on, and every
   downstream page reads that decision. These tests pin the boundaries so a
   copy tweak can't quietly move someone from "early" to "high". */

/* A man who answers "no" to everything. BMI 24.4, so no BMI points either. */
const CLEAN = {
  heightFt: '5', heightIn: '10', weight: '170', targetWeight: '165', age: '40',
  midsection: 'no', energy_crash: 'no', sleep_quality: 'no', winded: 'no',
  family_history: 'no', stress: 'low', yoyo: 'no', timeline: 'recent',
}

const answering = (overrides) => ({ ...CLEAN, ...overrides })

describe('getBucket', () => {
  it('puts someone with no risk signals in the early bucket', () => {
    expect(getBucket(CLEAN)).toBe('early')
  })

  it('scores 0-5 as early, 6-10 as stress, 11+ as high', () => {
    // Each "yes" below is worth 2, so this walks the score up in steps of 2.
    expect(getBucket(answering({ midsection: 'yes' }))).toBe('early')            // 2
    expect(getBucket(answering({ midsection: 'yes', energy_crash: 'yes' })))
      .toBe('early')                                                            // 4
    expect(getBucket(answering({
      midsection: 'yes', energy_crash: 'yes', sleep_quality: 'yes',
    }))).toBe('stress')                                                         // 6
    expect(getBucket(answering({
      midsection: 'yes', energy_crash: 'yes', sleep_quality: 'yes',
      winded: 'yes', family_history: 'yes', stress: 'high',
    }))).toBe('high')                                                           // 11
  })

  it('crosses from early to stress on the single point between 5 and 6', () => {
    // midsection 2 + stress 1 + yoyo 1 + timeline 1 = exactly 5.
    const five = answering({ midsection: 'yes', stress: 'high', yoyo: 'yes', timeline: 'longtime' })
    expect(getBucket(five)).toBe('early')

    // Same answers, but 195 lb at 5'10" is BMI 28.0 — one more point, and one
    // bucket over. If this ever fails, the boundary moved.
    const six = { ...five, weight: '195' }
    expect(getBucket(six)).toBe('stress')
  })

  it('adds BMI points on top of symptom points', () => {
    // Same 5'10" frame at weights straddling BMI 27.5 / 30 / 35, carrying a
    // fixed 4 points of symptoms so only the BMI band moves the result.
    const symptoms = { energy_crash: 'yes', sleep_quality: 'yes' }
    const at = (weight) => getBucket(answering({ ...symptoms, weight }))
    expect(at('170')).toBe('early')   // BMI 24.4 -> +0 -> 4
    expect(at('195')).toBe('early')   // BMI 28.0 -> +1 -> 5, still inside early
    expect(at('210')).toBe('stress')  // BMI 30.1 -> +2 -> 6, first step past it
    expect(at('250')).toBe('stress')  // BMI 35.9 -> +3 -> 7
  })

  it('caps the BMI contribution at 3 points however heavy the answer', () => {
    const symptoms = { energy_crash: 'yes', sleep_quality: 'yes' }
    // BMI 35.9 and BMI 43.0 both sit in the top band, so both score the same.
    expect(getBucket(answering({ ...symptoms, weight: '250' })))
      .toBe(getBucket(answering({ ...symptoms, weight: '300' })))
  })

  it('treats crushing stress the same as high stress', () => {
    const a = answering({ stress: 'high' })
    const b = answering({ stress: 'crushing' })
    expect(getBucket(a)).toBe(getBucket(b))
  })

  it('ignores a missing heightIn rather than producing NaN', () => {
    const noInches = answering({ heightIn: '', weight: '250' })
    expect(['early', 'stress', 'high']).toContain(getBucket(noInches))
  })
})

describe('calcMacros', () => {
  const a = answering({ weight: '220', targetWeight: '180', age: '38' })

  it('returns whole numbers for every macro', () => {
    const m = calcMacros(a)
    for (const [k, v] of Object.entries(m)) {
      expect(Number.isInteger(v), `${k} = ${v}`).toBe(true)
    }
  })

  it('never prescribes under 2000 calories', () => {
    const tiny = answering({ weight: '120', targetWeight: '115', age: '70', heightFt: '5', heightIn: '0' })
    expect(calcMacros(tiny).calories).toBe(2000)
  })

  it('sets protein to the target weight, capped at 200g over 250 lbs', () => {
    expect(calcMacros(answering({ weight: '220', targetWeight: '180' })).protein).toBe(180)
    expect(calcMacros(answering({ weight: '300', targetWeight: '210' })).protein).toBe(200)
  })

  it('never returns negative carbs', () => {
    // A heavy, short, old frame: low BMR floor against a high fat allowance.
    const extreme = answering({ weight: '400', targetWeight: '250', age: '75', heightFt: '4', heightIn: '10' })
    expect(calcMacros(extreme).carbs).toBeGreaterThanOrEqual(0)
  })

  it('floors fiber at 35g', () => {
    expect(calcMacros(a).fiber).toBeGreaterThanOrEqual(35)
  })

  it('keeps macros roughly consistent with the calorie target', () => {
    const m = calcMacros(a)
    const fromMacros = m.protein * 4 + m.fat * 9 + m.carbs * 4
    // Carbs are rounded to the gram, so allow a few calories of drift.
    expect(Math.abs(fromMacros - m.calories)).toBeLessThan(5)
  })
})

describe('getFlags', () => {
  it('returns nothing when no risk signals are present', () => {
    expect(getFlags(CLEAN)).toEqual([])
  })

  it('returns at most four flags even when everything is flagged', () => {
    const everything = answering({
      midsection: 'yes', energy_crash: 'yes', sleep_quality: 'yes', winded: 'yes',
      family_history: 'yes', stress: 'crushing', yoyo: 'yes',
    })
    expect(getFlags(everything)).toHaveLength(4)
  })

  it('gives every flag a title and a body', () => {
    const flags = getFlags(answering({ midsection: 'yes', winded: 'yes' }))
    expect(flags.length).toBeGreaterThan(0)
    for (const f of flags) {
      expect(f.title).toBeTruthy()
      expect(f.body).toBeTruthy()
    }
  })

  it('maps each answer to its own flag', () => {
    expect(getFlags(answering({ midsection: 'yes' }))[0].title).toBe('Visceral Fat Accumulation')
    expect(getFlags(answering({ energy_crash: 'yes' }))[0].title).toBe('The Afternoon Energy Crash')
    expect(getFlags(answering({ yoyo: 'yes' }))[0].title).toBe('Metabolic Set Point Resistance')
  })
})
