import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import metashiftLogo from './assets/MetaShiftLogoTrimmed.png'

/* ─── shared links ─────────────────────────────────────────────────── */
const CALENDLY_URL = 'https://calendly.com/luke-strassner-fit/1-1-mentorship-session'
// NOTE: must match APPS_SCRIPT_URL in App.jsx — same endpoint, fire-and-forget GET.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFz--iYveQkyXn9vLUpYuEVvWid0QOZp2vQW3yEcxeHIwvOllqtXTW5nOOJetJtys/exec'

/* Dedicated application endpoint — separate Apps Script project from the
   quiz one above, so applications get their own sheet and fire an instant
   Slack notification. Source lives in apps-script/application-notifier.gs.
   Paste the /exec URL from that deployment here. Until it is set, the
   application still logs to APPS_SCRIPT_URL and simply skips Slack. */
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
          <img src={metashiftLogo} alt="MetaShift Health" style={{ height: 28, width: 'auto', objectFit: 'contain', display: 'block' }} />
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
          MetaShift Health
        </div>
        <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>© 2026 MetaShift Health. All rights reserved.</span>
      </div>
    </footer>
  )
}

/* ─── contact fields ───────────────────────────────────────────────────
   Quiz traffic arrives with name/email/phone already in sessionStorage.
   Landing-page traffic does not, so we ask here — without a phone number
   there is no way to follow up with someone who applies and never books. */
/* Validation returns an error string, or null when the value is fine.

   Phone deliberately is NOT US-only — Luke coaches clients in Canada,
   Portugal, the Philippines and Dubai, so a strict 10-digit rule would
   reject real leads. The rule is: 7 to 15 digits, which is the ITU E.164
   range, with an optional leading +. */
function validateName(v) {
  return v.trim() ? null : 'Please enter your name.'
}

function validatePhone(v) {
  const raw = v.trim()
  if (!raw) return 'Please enter a phone number.'
  if (/[a-z]/i.test(raw)) return 'Numbers only please, no letters.'
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 7) return 'That looks too short. Include your area code.'
  if (digits.length > 15) return 'That looks too long. Check for an extra digit.'
  return null
}

function validateEmail(v) {
  const raw = v.trim()
  if (!raw) return 'Please enter an email address.'
  if (/\s/.test(raw)) return 'Email addresses cannot contain spaces.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw)) return "That does not look like an email address."
  return null
}

/* Formats as a US number while typing, but backs off the moment the value
   stops looking like one — a leading + or more than 10 digits means an
   international number, and we leave those exactly as typed. */
function formatPhoneInput(v) {
  if (v.trim().startsWith('+')) return v
  const d = v.replace(/\D/g, '')
  if (d.length > 10) return v
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

const CONTACT_FIELDS = [
  { id: 'name',  label: 'Full name',     type: 'text',  autoComplete: 'name',  placeholder: 'Jane Doe',        validate: validateName },
  { id: 'phone', label: 'Phone number',  type: 'tel',   autoComplete: 'tel',   placeholder: '(555) 123-4567',  validate: validatePhone, format: formatPhoneInput, hint: 'Outside the US? Start with + and your country code.' },
  { id: 'email', label: 'Email address', type: 'email', autoComplete: 'email', placeholder: 'you@example.com', validate: validateEmail },
]

function TextField({ field, value, error, onChange, onBlur }) {
  const borderColor = error ? '#C4453A' : value ? T.vital : T.line
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span style={{ display: 'block', fontFamily: T.mono, fontSize: 11.5, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkFaint, marginBottom: 7 }}>
        {field.label}
      </span>
      <input
        type={field.type}
        value={value}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
        aria-invalid={error ? 'true' : 'false'}
        onChange={e => onChange(field.id, field.format ? field.format(e.target.value) : e.target.value)}
        onBlur={() => onBlur(field.id)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '15px 17px',
          borderRadius: 12, border: `1.5px solid ${borderColor}`,
          background: T.paper, fontFamily: T.body, fontSize: 16, color: T.ink,
          outline: 'none', transition: 'border-color .15s',
        }}
      />
      {error ? (
        <span style={{ display: 'block', marginTop: 7, fontSize: 13.5, color: '#C4453A' }}>{error}</span>
      ) : field.hint ? (
        <span style={{ display: 'block', marginTop: 7, fontSize: 13, color: T.inkFaint }}>{field.hint}</span>
      ) : null}
    </label>
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

  // Prefill from the quiz lead when there is one, so quiz traffic is not
  // asked for details it already gave.
  const [contact, setContact] = useState(() => {
    try {
      const lead = (JSON.parse(sessionStorage.getItem('chainmover_results') || '{}').lead) || {}
      return { name: lead.name || '', phone: lead.phone || '', email: lead.email || '' }
    } catch (_) {
      return { name: '', phone: '', email: '' }
    }
  })

  // Which fields have been blurred at least once, or failed a submit attempt.
  // Errors stay hidden until then, so nobody is told they are wrong while
  // still typing the first character.
  const [touched, setTouched] = useState({})

  const setField = (id, value) => setContact(c => ({ ...c, [id]: value }))
  const markTouched = id => setTouched(t => ({ ...t, [id]: true }))

  const errors = {}
  CONTACT_FIELDS.forEach(f => {
    const err = f.validate(contact[f.id])
    if (err) errors[f.id] = err
  })

  const allAnswered = QUESTIONS.every(q => answers[q.id])
  const contactValid = Object.keys(errors).length === 0

  function submit() {
    if (submitting) return

    // Reveal every contact error at once rather than leaving a dead button.
    if (!contactValid) {
      setTouched(CONTACT_FIELDS.reduce((t, f) => ({ ...t, [f.id]: true }), {}))
      const firstBad = CONTACT_FIELDS.find(f => errors[f.id])
      if (firstBad) {
        const el = document.querySelector(`input[autocomplete="${firstBad.autoComplete}"]`)
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus({ preventScroll: true }) }
      }
      return
    }

    if (!allAnswered) return
    setSubmitting(true)

    try {
      let lead = {}
      try { lead = (JSON.parse(sessionStorage.getItem('chainmover_results') || '{}').lead) || {} } catch (_) { /* no lead */ }
      // Landing pages link here as /apply?src=... . Quiz traffic carries a
      // lead object with its own source; direct traffic has neither, so fall
      // back to the query param to keep these rows attributable.
      const src = new URLSearchParams(window.location.search).get('src') || ''
      const params = new URLSearchParams({
        form:           'application',
        // Typed values win — they are the ones the applicant just confirmed.
        name:           contact.name.trim()  || lead.name  || '',
        email:          contact.email.trim() || lead.email || '',
        phone:          contact.phone.trim() || lead.phone || '',
        instagram:      lead.instagram || '',
        source:         lead.source || src,
        bucket:         lead.bucket || '',
        weight_to_lose: answers.weight_to_lose || '',
        situation:      answers.situation || '',
        can_invest:     answers.can_invest || '',
        start_timeline: answers.start_timeline || '',
        timestamp:      new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
      })

      // Existing quiz endpoint — kept so the current sheet keeps receiving
      // applications. Safe to remove once the dedicated one is trusted.
      fetch(`${APPS_SCRIPT_URL}?${params}`, { mode: 'no-cors' })

      // Dedicated application endpoint — logs its own sheet and fires Slack.
      if (!APPLICATION_SCRIPT_URL.startsWith('PASTE_')) {
        fetch(`${APPLICATION_SCRIPT_URL}?${params}`, { mode: 'no-cors' })
      }
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
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: calRef.current,
          // Carry over what they just typed so booking is one less form to
          // fill, and so the Calendly invitee matches the application row.
          prefill: { name: contact.name, email: contact.email },
        })
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
  }, [submitted, contact.name, contact.email])

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

            <div style={{ marginBottom: 40 }}>
              <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkFaint, marginBottom: 10 }}>
                Last step
              </div>
              <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(20px,2.6vw,26px)', lineHeight: 1.25, color: T.ink, margin: '0 0 8px' }}>
                Where can Luke reach you?
              </h2>
              <p style={{ fontSize: 15, color: T.inkSoft, lineHeight: 1.55, margin: '0 0 20px' }}>
                So he can get hold of you directly if the calendar does not have a time that works.
              </p>
              {CONTACT_FIELDS.map(f => (
                <TextField
                  key={f.id}
                  field={f}
                  value={contact[f.id]}
                  error={touched[f.id] ? errors[f.id] : undefined}
                  onChange={setField}
                  onBlur={markTouched}
                />
              ))}
            </div>

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

            {/* No data-url here on purpose: widget.js auto-initializes any
                .calendly-inline-widget[data-url] it finds on load, which
                would override the manual init below and drop the prefill. */}
            <div
              ref={calRef}
              className="calendly-inline-widget"
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
