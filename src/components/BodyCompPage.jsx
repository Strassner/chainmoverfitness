'use client'

import { useEffect, useRef, useState } from 'react'
import chainmoverLogoImg from '../assets/ChainmoverLogo.png'

const chainmoverLogo = chainmoverLogoImg.src

/* ══════════════════════════════════════════════════════════════════════
   /bodycomp — single-purpose opt-in for the AI body composition funnel.

   Deliberately has no nav and no outbound links except the payoff: this
   traffic arrives from an Instagram story and has exactly one job. The
   logo is shown but not linked, so there is no exit path back into the
   site before they convert.

   Capture goes to the Cloudflare Worker, which holds the systeme.io key.
   The key cannot live here — this bundle is public, anyone can read it,
   and systeme.io's API rejects browser calls anyway (no Allow-Origin,
   and x-api-key is not in its allowed-headers list).
   ══════════════════════════════════════════════════════════════════════ */

/* The Gem does the photo upload and the analysis. We only capture the email
   and hand off — nothing about that conversation comes back to us. */
const GEM_URL = 'https://gemini.google.com/gem/1xUaaHoAk4u80nhW_7y7VNqbWrVY59Ytu?usp=sharing'

const WORKER_URL = 'https://pudge-score.chainmover.workers.dev'

/* Resolved when a request is made, not at module load. This page is
   prerendered to static HTML at build time, where there is no window to
   read a hostname from. */
function apiBase() {
  const h = window.location.hostname
  if (h === 'localhost' || h === '127.0.0.1') return 'http://127.0.0.1:8787' // wrangler dev
  return WORKER_URL
}

/* ─── brand tokens (match the rest of the site) ────────────────────── */
const T = {
  forest:    '#143D2B',
  forest600: '#246048',
  moss:      '#3A7D5C',
  vital:     '#46C98B',
  vitalSoft: '#C9EBD8',
  ink:       '#11241B',
  inkSoft:   '#46554D',
  inkFaint:  '#748178',
  paper:     '#FFFFFF',
  bone:      '#F3F7F3',
  mist:      '#E8F1EA',
  line:      '#DBE5DC',
  danger:    '#C4453A',
  display:   '"Archivo","Helvetica Neue",Arial,sans-serif',
  body:      '"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',
  mono:      '"IBM Plex Mono",ui-monospace,"SFMono-Regular",monospace',
}


/* Pseudo-states can't be done inline, so the few we need live here. */
const CSS = `
  .cm-bc input::placeholder { color: #A9B6AC; }
  .cm-bc input:focus { outline: none; border-color: ${T.vital}; box-shadow: 0 0 0 3px rgba(70,201,139,.18); }
  .cm-bc .btn { transition: transform .18s ease, box-shadow .2s ease, opacity .2s ease; }
  .cm-bc .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(70,201,139,.42); }
  .cm-bc .btn:active:not(:disabled) { transform: translateY(1px); }
  .cm-bc .btn:disabled { opacity: .6; cursor: default; box-shadow: none; }
`

/* Deliberately loose — the Worker validates properly. This only catches
   obvious typos before spending a round trip. */
export function looksLikeEmail(value) {
  const at = value.indexOf('@')
  if (at < 1 || at === value.length - 1) return false
  const domain = value.slice(at + 1)
  return domain.indexOf('.') > 0 && !domain.endsWith('.')
}

/**
 * Fires a Meta Pixel Lead event, if and only if a pixel is present. None is
 * installed sitewide today, so this is currently a no-op. Written this way so
 * adding a pixel later needs no change here, and so a missing one can never
 * throw and break the handoff.
 */
function trackLead() {
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: 'bodycomp' })
    }
  } catch {
    /* tracking must never block the conversion */
  }
}

export default function BodyCompPage() {

  const [email, setEmail] = useState('')
  const [consented, setConsented] = useState(false)
  const [status, setStatus] = useState('idle') // idle | busy | done
  const [error, setError] = useState('')
  const gemRef = useRef(null)

  // Move focus to the payoff once it appears, so it isn't missed.
  useEffect(() => {
    if (status === 'done' && gemRef.current) gemRef.current.focus()
  }, [status])

  function fail(message) {
    setError(message)
    setStatus('idle') // the typed email is never cleared — retry costs nothing
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const value = email.trim()
    if (!value) return fail('Enter your email address.')
    if (!looksLikeEmail(value)) return fail("That doesn't look like a valid email address.")
    // The button is disabled without consent, so this is belt-and-braces —
    // it catches a submit forced by other means. Consent is not optional.
    if (!consented) return fail('Tick the box to confirm you want the emails.')

    setError('')
    setStatus('busy')

    let res
    try {
      res = await fetch(`${apiBase()}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      })
    } catch {
      return fail("Couldn't reach us. Check your connection and try again.")
    }

    if (res.status === 400) return fail('That email address was rejected. Check it and try again.')
    if (res.status === 429) return fail('Too many attempts. Give it a few minutes and try again.')
    if (!res.ok && res.status !== 202) return fail('Something went wrong on our end. Try that again.')

    // 200 = captured. 202 = systeme.io hiccuped but we have their address and
    // they held up their end — let them through either way.
    trackLead()
    setStatus('done')
  }

  const btnStyle = {
    display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center',
    fontFamily: T.body, fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em',
    padding: '17px 30px', border: 'none', borderRadius: 100, cursor: 'pointer',
    textDecoration: 'none', background: T.vital, color: T.forest,
    boxShadow: '0 8px 22px rgba(70,201,139,.32)',
  }

  return (
    <div
      className="cm-bc"
      style={{
        minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(24px,6vw,56px) clamp(20px,5vw,32px)',
        fontFamily: T.body, fontSize: 17, lineHeight: 1.6, letterSpacing: '-0.005em', color: T.ink,
        background: `radial-gradient(120% 90% at 50% 0%,${T.mist} 0%,rgba(232,241,234,0) 58%),${T.paper}`,
      }}
    >
      <style>{CSS}</style>

      <div style={{ width: '100%', maxWidth: 470, textAlign: 'center' }}>

        {/* Shown, not linked — no exit path before they convert. The mark has
            no wordmark in it, so the name has to sit beside it. */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 'clamp(22px,5vw,34px)' }}>
          <img src={chainmoverLogo} alt="" style={{ height: 30, width: 'auto', objectFit: 'contain', display: 'block', borderRadius: 7 }} />
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 15.5, letterSpacing: '-0.02em' }}>Chainmover Coaching</span>
        </div>

        <span style={{ display: 'block', fontFamily: T.mono, fontSize: 11.5, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, marginBottom: 14 }}>
          Free body composition check
        </span>

        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(31px,8vw,44px)', lineHeight: 1.07, letterSpacing: '-0.03em', margin: 0, textWrap: 'balance' }}>
          Get your real body composition % in 60 seconds
        </h1>

        {/* <p style={{ margin: '16px auto 0', maxWidth: '27em', fontSize: 'clamp(15.5px,4vw,17.5px)', color: T.inkSoft }}>
          Just upload a photo. 
        </p> */}

        {status !== 'done' ? (
          <form onSubmit={handleSubmit} noValidate style={{ marginTop: 'clamp(24px,6vw,32px)' }}>
            <label htmlFor="bc-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
              Email address
            </label>
            <input
              id="bc-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
              style={{
                width: '100%', padding: '16px 18px', fontFamily: T.body,
                fontSize: 16, /* 16px minimum or iOS Safari zooms the page on focus */
                color: T.ink, background: T.paper,
                border: `1px solid ${error ? T.danger : T.line}`, borderRadius: 12, textAlign: 'center',
              }}
            />
            {/* Explicit consent, unticked by default. The label is the tap
                target too, which matters on a phone. */}
            <label
              htmlFor="bc-consent"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 11,
                margin: '16px auto 0', maxWidth: '25em',
                textAlign: 'left', fontSize: 14, lineHeight: 1.45,
                color: T.inkSoft, cursor: 'pointer',
              }}
            >
              <input
                id="bc-consent"
                type="checkbox"
                checked={consented}
                onChange={(e) => { setConsented(e.target.checked); if (error) setError('') }}
                style={{ flex: 'none', width: 20, height: 20, marginTop: 1, accentColor: T.vital, cursor: 'pointer' }}
              />
              <span>
                Yes, email me fat loss and metabolic health tips from Luke.
                Unsubscribe any time.
              </span>
            </label>

            <button
              type="submit"
              className="btn"
              disabled={status === 'busy' || !consented}
              style={{ ...btnStyle, marginTop: 14 }}
            >
              {status === 'busy' ? 'One second…' : 'Show me the tool'}
            </button>

            {/* Says why the button is dead rather than leaving them guessing. */}
            {!consented && !error && (
              <p style={{ margin: '10px 0 0', fontFamily: T.mono, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkFaint }}>
                Tick the box above to continue
              </p>
            )}

            {error && (
              <p role="alert" style={{ margin: '12px 0 0', fontSize: 14.5, color: T.danger }}>{error}</p>
            )}
          </form>
        ) : (
          /* They click through themselves — nothing auto-redirects. */
          <div style={{ marginTop: 'clamp(24px,6vw,32px)', padding: 'clamp(22px,6vw,30px) clamp(18px,5vw,26px)', background: T.bone, border: `1px solid ${T.line}`, borderRadius: 18 }}>
            <div style={{ width: 46, height: 46, margin: '0 auto 14px', borderRadius: '50%', background: T.vitalSoft, display: 'grid', placeItems: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: 'none', stroke: T.forest600, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <path d="M5 12.6l4.6 4.4L19 7.6" />
              </svg>
            </div>
            <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 25, letterSpacing: '-0.025em', margin: 0 }}>You're in.</h2>
            <p style={{ margin: '8px 0 20px', fontSize: 15.5, color: T.inkSoft }}>Open the tool, upload a photo, get your number.</p>
            <a
              ref={gemRef}
              className="btn"
              href={GEM_URL}
              target="_blank"
              rel="noopener"
              style={{ ...btnStyle, padding: '19px 34px', fontSize: 18 }}
            >
              Get Your Number →
            </a>
            <p style={{ margin: '12px 0 0', fontFamily: T.mono, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: T.inkFaint }}>
              Opens in a new tab.
            </p>
          </div>
        )}

        {/* <p style={{ margin: 'clamp(26px,6vw,34px) auto 0', maxWidth: '32em', fontSize: 12, lineHeight: 1.55, color: T.inkFaint }}>
          An AI visual estimate for motivation, not a medical or diagnosis.
        </p> */}

        <p style={{ margin: '16px 0 0', fontFamily: T.mono, fontSize: 10.5, letterSpacing: '.1em', color: T.inkFaint }}>
          Chainmover Coaching · Luke Strassner, Head Coach
        </p>

      </div>
    </div>
  )
}
