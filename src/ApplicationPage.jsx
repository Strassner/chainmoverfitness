import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'

/* ─── shared links ─────────────────────────────────────────────────── */
const CALENDLY_URL = 'https://calendly.com/luke-strassner-fit/1-1-mentorship-session'
// NOTE: must match APPS_SCRIPT_URL in App.jsx — same endpoint, fire-and-forget GET.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFz--iYveQkyXn9vLUpYuEVvWid0QOZp2vQW3yEcxeHIwvOllqtXTW5nOOJetJtys/exec'

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

function useFonts() {
  useEffect(() => {
    if (document.getElementById('chainmover-fonts')) return
    const link = document.createElement('link')
    link.id = 'chainmover-fonts'
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'
    document.head.appendChild(link)
  }, [])
}

/* ─── application questions ────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: 'weight_to_lose',
    q: 'How much weight are you looking to lose?',
    options: [
      { value: '30–60 lbs', label: '30–60 lbs' },
      { value: '60–100 lbs', label: '60–100 lbs' },
      { value: '100+ lbs', label: '100+ lbs' },
    ],
  },
  {
    id: 'situation',
    q: "Which best describes where you're at?",
    options: [
      { value: "Tried diets, nothing worked", label: "I've tried diets before and nothing's worked" },
      { value: "Struggle to believe it's possible", label: 'I struggle to believe I can really do this' },
      { value: "Can't trust myself to commit", label: "I've failed so many times I can't trust myself to commit" },
    ],
  },
  {
    id: 'can_invest',
    q: 'If it turns out to be a good fit, are you in a position to invest in your health right now?',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
  },
  {
    id: 'start_timeline',
    q: 'How soon do you want to start?',
    options: [
      { value: 'Ready now', label: "I'm ready now" },
      { value: 'Within a month', label: 'Within the next month' },
      { value: 'Just exploring', label: 'Just exploring' },
    ],
  },
]

/* ─── header / footer ──────────────────────────────────────────────── */
function Header() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', height: 72 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }} />
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
          <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 32, width: 'auto', objectFit: 'contain', display: 'block' }} />
          Chainmover Fitness
        </div>
        <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>© 2026 Chainmover Fitness. All rights reserved.</span>
      </div>
    </footer>
  )
}

/* ─── option card ──────────────────────────────────────────────────── */
function OptionCard({ selected, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
        background: selected ? T.mist : T.paper,
        border: `1.5px solid ${selected ? T.vital : T.line}`,
        borderRadius: 12, padding: '16px 18px', marginBottom: 10,
        fontFamily: T.body, fontSize: 16, fontWeight: selected ? 600 : 500, color: T.ink,
        boxShadow: selected ? '0 4px 14px rgba(70,201,139,.18)' : 'none',
        transition: 'all .12s',
      }}
    >
      {label}
    </button>
  )
}

/* ─── application page ─────────────────────────────────────────────── */
export default function ApplicationPage() {
  useFonts()
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const calRef = useRef(null)

  const allAnswered = QUESTIONS.every(q => answers[q.id])

  function submit() {
    if (!allAnswered || submitting) return
    setSubmitting(true)

    // Fire the application to the same endpoint the quiz uses (fire-and-forget GET).
    try {
      let lead = {}
      try { lead = (JSON.parse(sessionStorage.getItem('chainmover_results') || '{}').lead) || {} } catch (_) { /* no lead */ }
      const params = new URLSearchParams({
        form:           'application',
        name:           lead.name || '',
        email:          lead.email || '',
        phone:          lead.phone || '',
        instagram:      lead.instagram || '',
        source:         lead.source || '',
        bucket:         lead.bucket || '',
        weight_to_lose: answers.weight_to_lose || '',
        situation:      answers.situation || '',
        can_invest:     answers.can_invest || '',
        start_timeline: answers.start_timeline || '',
        timestamp:      new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
      })
      fetch(`${APPS_SCRIPT_URL}?${params}`, { mode: 'no-cors' })
    } catch (_) { /* silent fail — never block the booking step */ }

    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Inline Calendly embed — only once they've submitted and reached the booking step.
  useEffect(() => {
    if (!submitted) return

    if (!document.getElementById('calendly-widget-css')) {
      const css = document.createElement('link')
      css.id = 'calendly-widget-css'
      css.rel = 'stylesheet'
      css.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(css)
    }

    function init() {
      if (window.Calendly && calRef.current) {
        calRef.current.innerHTML = '' // guard against double-init (StrictMode / re-render)
        window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: calRef.current })
      }
    }

    if (window.Calendly) { init(); return }

    let script = document.getElementById('calendly-widget-script')
    if (!script) {
      script = document.createElement('script')
      script.id = 'calendly-widget-script'
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)
    }
    script.addEventListener('load', init)
    return () => script && script.removeEventListener('load', init)
  }, [submitted])

  return (
    <div style={{ background: T.paper, minHeight: '100svh', fontFamily: T.body, color: T.ink, display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, maxWidth: 760, width: '100%', margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', paddingBlock: 'clamp(40px,6vw,72px)' }}>
        {!submitted ? (
          <>
            <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'block', marginBottom: 16 }}>
              Application · takes 30 seconds
            </span>
            <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
              Apply to work with Luke
            </h1>
            <p style={{ marginTop: 18, marginBottom: 48, fontSize: 'clamp(16px,1.6vw,19px)', lineHeight: 1.6, color: T.inkSoft, maxWidth: 560 }}>
              A few quick questions so we can see if the program is a fit — and so your call goes straight to your plan instead of logistics.
            </p>

            {QUESTIONS.map((q, i) => (
              <div key={q.id} style={{ marginBottom: 40 }}>
                <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkFaint, marginBottom: 10 }}>
                  Question {i + 1} of {QUESTIONS.length}
                </div>
                <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(20px,2.6vw,26px)', lineHeight: 1.25, color: T.ink, margin: '0 0 18px' }}>
                  {q.q}
                </h2>
                {q.options.map(opt => (
                  <OptionCard
                    key={opt.value}
                    selected={answers[q.id] === opt.value}
                    label={opt.label}
                    onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.value }))}
                  />
                ))}
              </div>
            ))}

            <button
              type="button"
              onClick={submit}
              disabled={!allAnswered || submitting}
              style={{
                width: '100%', marginTop: 8, cursor: allAnswered ? 'pointer' : 'not-allowed',
                background: allAnswered ? T.vital : T.lineSoft,
                color: allAnswered ? T.forest : T.inkFaint,
                border: 'none', borderRadius: 100, padding: '18px 32px',
                fontFamily: T.body, fontWeight: 700, fontSize: 17,
                boxShadow: allAnswered ? '0 8px 22px rgba(70,201,139,.3)' : 'none',
                transition: 'all .15s',
              }}
            >
              {submitting ? 'One moment…' : 'Submit application →'}
            </button>
            <p style={{ fontSize: 12.5, color: T.inkFaint, textAlign: 'center', marginTop: 16 }}>
              We don't sell or share your info. Ever.
            </p>
          </>
        ) : (
          <>
            <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.vital, display: 'block', marginBottom: 16 }}>
              Application received
            </span>
            <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(30px,4.6vw,48px)', lineHeight: 1.06, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
              Book your discovery call with Luke
            </h1>
            <p style={{ marginTop: 18, marginBottom: 8, fontSize: 'clamp(16px,1.6vw,19px)', lineHeight: 1.6, color: T.inkSoft, maxWidth: 600 }}>
              We'll go over your results in detail and see if this is the right fit. You'll leave knowing exactly what's not working right inside your body — and the plan to fix it. Grab the time that works best:
            </p>

            <div
              ref={calRef}
              className="calendly-inline-widget"
              data-url={CALENDLY_URL}
              style={{ minWidth: 320, height: 720, marginTop: 24 }}
            />

            <p style={{ fontSize: 14, color: T.inkSoft, textAlign: 'center', marginTop: 16 }}>
              Trouble seeing the calendar?{' '}
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer" style={{ color: T.forest, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}>
                Open it in a new tab →
              </a>
            </p>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
