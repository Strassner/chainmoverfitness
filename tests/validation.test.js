import { describe, it, expect } from 'vitest'
import { looksLikeEmail } from '@/components/BodyCompPage'

/* /apply no longer collects contact details — it embeds Calendly directly,
   and Calendly does its own validation — so the only email gate left in our
   own code is the one on /bodycomp. */

describe('looksLikeEmail (the loose /bodycomp pre-check)', () => {
  it('accepts what it should', () => {
    expect(looksLikeEmail('luke@gmail.com')).toBe(true)
    expect(looksLikeEmail('a@b.co')).toBe(true)
  })

  it('rejects a missing @, a leading @, and a trailing @', () => {
    expect(looksLikeEmail('lukegmail.com')).toBe(false)
    expect(looksLikeEmail('@gmail.com')).toBe(false)
    expect(looksLikeEmail('luke@')).toBe(false)
  })

  it('requires a dot inside the domain, not at its end', () => {
    expect(looksLikeEmail('luke@gmail')).toBe(false)
    expect(looksLikeEmail('luke@gmail.')).toBe(false)
    expect(looksLikeEmail('luke@.com')).toBe(false)
  })

  it('is loose on purpose — the Worker does the real check', () => {
    expect(looksLikeEmail('luke@gmail.c')).toBe(true)
  })
})
