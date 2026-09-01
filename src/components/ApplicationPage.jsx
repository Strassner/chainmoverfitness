'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import chainmoverLogoImg from '../assets/ChainmoverLogo.png'

const chainmoverLogo = chainmoverLogoImg.src

/* ─── shared links ─────────────────────────────────────────────────── */
const TYPEFORM_URL = 'https://form.typeform.com/to/o0oRp5Ie'
// NOTE: must match APPS_SCRIPT_URL in App.jsx — same endpoint, fire-and-forget GET.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFz--iYveQkyXn9vLUpYuEVvWid0QOZp2vQW3yEcxeHIwvOllqtXTW5nOOJetJtys/exec'

/* Dedicated application endpoint — separate Apps Script project from the
   quiz one above, so bookings get their own sheet and fire an instant
   Slack notification. Source lives in apps-script/application-notifier.gs.
   Paste the /exec URL from that deployment here. Until it is set, the
   booking still logs to APPS_SCRIPT_URL and simply skips Slack. */
const APPLICATION_SCRIPT_URL = 'PASTE_APPLICATION_SCRIPT_EXEC_URL_HERE'

/* ─── brand tokens (match BucketPage) ──────────────────────────────── */
const T = {
  forest:    '#143D2B',
  forest700: '#1A4B35',
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
  lineSoft:  '#EAF0EA',
  display:   '"Archivo","Helvetica Neue",Arial,sans-serif',
  body:      '"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',
  mono:      '"IBM Plex Mono",ui-monospace,"SFMono-Regular",monospace',
  shadow:    '0 10px 30px rgba(17,36,27,.08),0 2px 8px rgba(17,36,27,.05)',
}

/* ─── header / footer ──────────────────────────────────────────────── */
function Header() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', height: 72 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={chainmoverLogo} alt="" style={{ height: 34, width: 'auto', objectFit: 'contain', display: 'block' }} />
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: T.ink, whiteSpace: 'nowrap' }}>Chainmover Coaching</span>
        </Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer style={{ background: T.ink, color: '#fff', paddingBlock: 40, marginTop: 64 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.display, fontWeight: 800, fontSize: 18 }}>
          Chainmover Coaching
        </div>
        <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>Luke Strassner, Head Coach</span>
      </div>
    </footer>
  )
}

/* What the call is, in the three lines someone scans before picking a time.
   This is the only screening left on the page now that the questions are
   gone, so it has to do that job in one glance. */
const EXPECT = [
  'Forty-five minutes, one-on-one with Luke — not a setter, not a sales team.',
  'We go through what is actually driving your numbers and what has to change first.',
  'If the program is not the right fit, you will hear that on the call.',
]

/* ─── booking page ─────────────────────────────────────────────────── */
export default function ApplicationPage() {
  const calRef = useRef(null)
  const logged = useRef(false)

  /* Quiz traffic arrives with name/email/phone and a bucket in sessionStorage.
     A ref, not state: nothing on the page renders from it, and a re-render
     would re-run the effect below and re-initialise Calendly, throwing away a
     part-filled booking. It is read inside the effect for the same reason the
     old form read it there — this page is prerendered to static HTML at build
     time, where there is no sessionStorage, so reading during render would
     disagree with the served HTML. */
  const lead = useRef({})

  /* Log a completed submission to the existing sheet endpoints. Best effort:
     if it never fires the response still exists in Typeform. */
  function logSubmission(responseId) {
    if (logged.current) return
    logged.current = true

    try {
      const src = new URLSearchParams(window.location.search).get('src') || ''
      const params = new URLSearchParams({
        form:      'booking',
        name:      lead.current.name || '',
        email:     lead.current.email || '',
        phone:     lead.current.phone || '',
        instagram: lead.current.instagram || '',
        //   source   = where they found Luke (YouTube, Instagram…), from the quiz
        //   page_src = which page sent them here (quiz_high, metabolic…)
        source:    lead.current.source || src,
        page_src:  src,
        bucket:    lead.current.bucket || '',
        response_id: responseId || '',
        timestamp: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
      })

      // Existing quiz endpoint — kept so the current sheet keeps receiving
      // these rows. Safe to remove once the dedicated one is trusted.
      fetch(`${APPS_SCRIPT_URL}?${params}`, { mode: 'no-cors' })

      // Dedicated endpoint — logs its own sheet and fires Slack.
      if (!APPLICATION_SCRIPT_URL.startsWith('PASTE_')) {
        fetch(`${APPLICATION_SCRIPT_URL}?${params}`, { mode: 'no-cors' })
      }
    } catch (_) { /* silent fail — never get in the way of a confirmed submission */ }
  }

  /* Inline Typeform embed. Mounts once. */
  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('chainmover_results') || '{}').lead
      if (stored?.email) lead.current = stored
    } catch (_) { /* no quiz data, or storage is blocked — treat as cold traffic */ }

    let widget = null

    function init() {
      if (!window.tf || !calRef.current) return
      calRef.current.innerHTML = '' // guard against double-init (StrictMode / re-render)
      // Landing pages link here as /apply?src=… . Quiz traffic also carries
      // its own source (where they found Luke), and the two are different
      // dimensions — keep both rather than letting one overwrite the other.
      const src = new URLSearchParams(window.location.search).get('src') || ''
      widget = window.tf.createWidget(TYPEFORM_URL, {
        container: calRef.current,
        // Quiz applicants have already typed all of this once. Only fills a
        // field if the form defines a matching hidden field — harmless
        // otherwise.
        hidden: {
          name:   lead.current.name || '',
          email:  lead.current.email || '',
          phone:  lead.current.phone || '',
          source: lead.current.source || src || 'direct',
          bucket: lead.current.bucket || '',
        },
        onSubmit: (event) => logSubmission(event?.responseId),
      })
    }

    if (window.tf) { init(); return () => widget?.unmount?.() }

    let script = document.getElementById('typeform-embed-script')
    if (!script) {
      script = document.createElement('script')
      script.id = 'typeform-embed-script'
      script.src = 'https://embed.typeform.com/next/embed.js'
      script.async = true
      document.body.appendChild(script)
    }
    script.addEventListener('load', init)
    return () => {
      script && script.removeEventListener('load', init)
      widget?.unmount?.()
    }
  }, [])

  return (
    <div style={{ background: T.paper, minHeight: '100svh', fontFamily: T.body, color: T.ink, display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, maxWidth: 760, width: '100%', margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', paddingBlock: 'clamp(36px,5vw,60px)' }}>
        {/* <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'block', marginBottom: 16 }}>
          Book your call
        </span>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
          Book your 1-on-1 call with Luke
        </h1> */}
        {/* <p style={{ marginTop: 18, marginBottom: 24, fontSize: 'clamp(16px,1.6vw,19px)', lineHeight: 1.6, color: T.inkSoft, maxWidth: 600 }}>
          No application to fill in first. Choose a slot below and you will leave that
          conversation understanding what is actually driving your numbers, either way.
        </p> */}

        {/* <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, display: 'grid', gap: 10 }}>
          {EXPECT.map(line => (
            <li key={line} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15.5, lineHeight: 1.5, color: T.inkSoft }}>
              <span aria-hidden="true" style={{ flex: 'none', marginTop: 7, width: 7, height: 7, borderRadius: 99, background: T.vital }} />
              {line}
            </li>
          ))}
        </ul> */}

        {/* Typeform's own widget CSS never loads (no widget.css link like
            Calendly ships), so its .tf-v1-widget wrapper and iframe default
            to a tiny fixed size instead of filling this container. Force
            them to fill it ourselves. */}
        <style>{`
          .tf-v1-widget, .tf-v1-widget iframe { width: 100% !important; height: 100% !important; }
        `}</style>

        {/* Breaks out of the 760px reading column so the embed gets full width. */}
        <div
          ref={calRef}
          style={{
            position: 'relative', left: '50%', transform: 'translateX(-50%)',
            width: 'min(1040px, 100vw - 2 * clamp(20px,5vw,48px))',
            minWidth: 320, height: 780,
          }}
        />

        <p style={{ fontSize: 14, color: T.inkSoft, textAlign: 'center', marginTop: 16 }}>
          Trouble seeing the form?{' '}
          <a href={TYPEFORM_URL} target="_blank" rel="noreferrer" style={{ color: T.forest, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}>
            Open it in a new tab →
          </a>
        </p>
        <p style={{ fontSize: 12.5, color: T.inkFaint, textAlign: 'center', marginTop: 10 }}>
          We don't sell or share your info. Ever.
        </p>
      </main>

      <Footer />
    </div>
  )
}
