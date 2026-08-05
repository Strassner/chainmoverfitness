import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'

/* ══════════════════════════════════════════════════════════════════════
   ISOLATED TEST ROUTE — /buy  (gated checkout: fit-screening application
   runs first, plan picker only reveals once qualified)
   Fully self-contained. All styles scoped under `.mroi-buy`.
   ══════════════════════════════════════════════════════════════════════ */

/* Payment links (HubFit checkout). */
const CHECKOUT_MONTHLY_URL  = 'https://app.hubfit.com/plan/6a6b6f098f234c08d41b7a4f'
const CHECKOUT_SIXMONTH_URL = 'https://app.hubfit.com/plan/6a637908cf608505ae6651b7'

/* Product name — this is what's being sold. Framed as a system/blueprint
   you follow, not a coaching relationship you have to trust blind. */
const PRODUCT_NAME = 'The 300lb to Lean Blueprint'

// NOTE: must match APPS_SCRIPT_URL in App.jsx / ApplicationPage.jsx — same endpoint, fire-and-forget GET.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFz--iYveQkyXn9vLUpYuEVvWid0QOZp2vQW3yEcxeHIwvOllqtXTW5nOOJetJtys/exec'

/* Fit-screening questions, asked before the plan picker is revealed. */
const GATE_QUESTIONS = [
  {
    id: 'follow_plan',
    q: 'Are you willing to follow the plan even if it goes against mainstream advice?',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    failValues: ['No'],
  },
  {
    id: 'honest_conversations',
    q: 'Are you willing to have open and honest conversations about your actions during the week, no matter what?',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    failValues: ['No'],
  },
  {
    id: 'pushed_outside_comfort',
    q: 'Are you willing to be pushed outside your comfort zone to reach your goals?',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    failValues: ['No'],
  },
  {
    id: 'start_timeline',
    q: 'How soon are you ready to start?',
    options: [
      { value: 'Ready now', label: 'Ready now' },
      { value: 'Within the next few weeks', label: 'Within the next few weeks' },
      { value: 'Just exploring, not ready yet', label: 'Just exploring, not ready yet' },
    ],
    failValues: ['Just exploring, not ready yet'],
  },
]

const T = {
  forest:    '#143D2B',
  forest700: '#1A4B35',
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
  lineSoft:  '#EAF0EA',
  display:   '"Archivo","Helvetica Neue",Arial,sans-serif',
  body:      '"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',
  mono:      '"IBM Plex Mono",ui-monospace,"SFMono-Regular",monospace',
  shadow:    '0 10px 30px rgba(17,36,27,.08),0 2px 8px rgba(17,36,27,.05)',
  shadowLg:  '0 30px 70px rgba(17,36,27,.16),0 8px 24px rgba(17,36,27,.08)',
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

const CSS = `
  .mroi-buy * { box-sizing: border-box; }
  .mroi-buy { font-family: ${T.body}; color: ${T.ink}; background: ${T.bone}; min-height: 100svh; font-size: 17px; line-height: 1.6; letter-spacing: -0.005em; }
  .mroi-buy h1,.mroi-buy h2,.mroi-buy h3 { font-family: ${T.display}; font-weight: 800; line-height: 1.1; letter-spacing: -0.025em; margin: 0; color: ${T.ink}; }
  .mroi-buy p { margin: 0; }
  .mroi-buy a { color: inherit; text-decoration: none; }
  .mroi-buy img { max-width: 100%; display: block; }

  .mroi-buy .eyebrow { font-family: ${T.mono}; font-size: 12px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: ${T.moss}; }

  .mroi-buy .plan { text-align: left; width: 100%; display: flex; align-items: flex-start; gap: 14px; padding: 20px; border-radius: 16px; border: 2px solid ${T.line}; background: ${T.paper}; cursor: pointer; transition: border-color .2s, box-shadow .2s; }
  .mroi-buy .plan:hover { border-color: ${T.moss}; }
  .mroi-buy .plan.sel { border-color: ${T.vital}; box-shadow: 0 8px 22px rgba(70,201,139,.18); }
  .mroi-buy .plan .dot { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; border: 2px solid ${T.line}; margin-top: 2px; display: grid; place-items: center; }
  .mroi-buy .plan.sel .dot { border-color: ${T.vital}; }
  .mroi-buy .plan.sel .dot::after { content: ""; width: 12px; height: 12px; border-radius: 50%; background: ${T.vital}; }

  .mroi-buy .cta { display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; font-family: ${T.body}; font-weight: 700; font-size: 18px; padding: 20px 28px; border-radius: 100px; border: none; cursor: pointer; transition: transform .18s ease, box-shadow .2s ease, background .2s, opacity .2s; letter-spacing: -0.01em; }
  .mroi-buy .cta-primary { background: ${T.vital}; color: ${T.forest}; box-shadow: 0 10px 26px rgba(70,201,139,.36); }
  .mroi-buy .cta-primary:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(70,201,139,.46); }
  .mroi-buy .cta:disabled { background: ${T.line}; color: ${T.inkFaint}; cursor: not-allowed; box-shadow: none; }

  .mroi-buy .gate-opt { display: block; text-align: left; width: 100%; padding: 14px 18px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; cursor: pointer; font-family: ${T.body}; font-size: 15px; font-weight: 500; color: ${T.ink}; transition: border-color .15s, background .15s, box-shadow .15s; }
  .mroi-buy .gate-opt:hover { border-color: ${T.moss}; }
  .mroi-buy .gate-opt.sel { border-color: ${T.vital}; background: ${T.mist}; font-weight: 600; box-shadow: 0 4px 14px rgba(70,201,139,.18); }

  .mroi-buy .agree { display: flex; gap: 13px; align-items: flex-start; padding: 18px; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.bone}; cursor: pointer; transition: border-color .2s, background .2s; }
  .mroi-buy .agree:hover { border-color: ${T.moss}; }
  .mroi-buy .agree.checked { border-color: ${T.vital}; background: ${T.mist}; }
  .mroi-buy .agree input { width: 22px; height: 22px; margin: 1px 0 0; accent-color: ${T.forest}; flex-shrink: 0; cursor: pointer; }
  .mroi-buy .agree span { font-size: 14.5px; line-height: 1.55; color: ${T.inkSoft}; }

  .mroi-buy .faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 20px 0; font-family: ${T.display}; font-weight: 700; font-size: 16px; color: ${T.ink}; border-top: 1px solid ${T.line}; user-select: none; }
  .mroi-buy .faq summary::-webkit-details-marker { display: none; }
  .mroi-buy .faq summary .ico::after { content: "+"; font-size: 20px; font-weight: 400; color: ${T.moss}; transition: transform .25s; display: inline-block; }
  .mroi-buy .faq[open] summary .ico::after { transform: rotate(45deg); }
  .mroi-buy .faq .ans { padding: 0 0 20px; font-size: 14.5px; color: ${T.inkSoft}; line-height: 1.65; }

  @media (max-width: 900px) { .mroi-buy .checkout-grid { grid-template-columns: 1fr !important; } .mroi-buy .summary-col { position: static !important; } }
`

function Wrap({ children, style }) {
  return <div style={{ maxWidth: 1000, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', ...style }}>{children}</div>
}

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 15, height: 15, color: T.vital, flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const INCLUDED = [
  'Onboarding: a welcome call, your Metabolic Risk Assessment, and Day 1 of your Blueprint built and ready to follow',
  'Your full Blueprint, nutrition, stress and sleep, and movement, engineered on the M.R.O.I. method',
  'Weekly recalibrations, your Blueprint reviewed and adjusted every week based on your real data',
  'Built-in support, message access between check ins plus the private client community',
  'The Safety Net, your 14 day money back guarantee',
]

function Header() {
  return (
    <header style={{ background: T.paper, borderBottom: `1px solid ${T.lineSoft}` }}>
      <div style={{ background: T.forest, color: '#fff', textAlign: 'center', padding: '9px 16px', fontFamily: T.mono, fontSize: 13, letterSpacing: '.02em' }}>
        Only <span style={{ textDecoration: 'line-through', opacity: .6 }}>15</span> <b style={{ color: T.vital, fontSize: 14 }}>11 slots</b> open for August
      </div>
      <Wrap>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70, gap: 16 }}>
          <Link to="/landing" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 17, color: T.ink }}>Chainmover</span>
          </Link>
          <Link to="/landing" style={{ fontFamily: T.mono, fontSize: 12.5, color: T.inkSoft }}>Back</Link>
        </div>
      </Wrap>
    </header>
  )
}

/* Order summary (left) */
function Summary() {
  return (
    <div className="summary-col" style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
      <div style={{ background: T.forest, color: '#fff', borderRadius: 22, padding: 'clamp(28px,3.5vw,40px)', boxShadow: T.shadowLg }}>
        <span className="eyebrow" style={{ color: T.vital }}>What you're getting</span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(24px,2.8vw,32px)', marginTop: 12 }}>{PRODUCT_NAME}</h2>
        <p style={{ marginTop: 14, fontSize: 15, color: 'rgba(255,255,255,.78)', lineHeight: 1.6 }}>
          A done-for-you system that tells you exactly what to do, every day, until the weight is gone for good. Works from any starting point, built and personally overseen by Luke, never handed off to a sub coach.
        </p>
        <ul style={{ listStyle: 'none', margin: '24px 0 0', padding: '22px 0 0', borderTop: '1px solid rgba(255,255,255,.14)', display: 'flex', flexDirection: 'column', gap: 13 }}>
          {INCLUDED.map(item => (
            <li key={item} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 14.5, color: 'rgba(255,255,255,.9)', lineHeight: 1.5 }}>
              {CHECK}{item}
            </li>
          ))}
        </ul>
      </div>

      {/* guarantee */}
      <div style={{ marginTop: 20, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 18, padding: '24px 26px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', border: `2px solid ${T.vitalSoft}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={T.forest} strokeWidth="2" style={{ width: 24, height: 24 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <div>
          <b style={{ fontFamily: T.display, fontSize: 17, color: T.ink, display: 'block' }}>Try it for 14 days</b>
          <p style={{ marginTop: 8, fontSize: 14.5, color: T.inkSoft, lineHeight: 1.6 }}>
            Do the check ins. Follow the week 1 plan. If it is not for you, message me and get every dollar back. No forms, no runaround.
          </p>
        </div>
      </div>
    </div>
  )
}

/* Enrollment + cancellation terms, per plan. Switches with the plan
   selector below since the two plans have different commitments. */
const PLAN_TERMS = {
  monthly: {
    bullets: [
      'Monthly billing at $197/month, starting today',
      'Your first 14 days are covered by our money-back guarantee',
      'No minimum commitment, cancel anytime',
      'Cancellation is just a message to Luke in the app',
    ],
    cancellation: [
      { when: 'Within your first 14 days', body: 'Full refund guarantee. Message Luke in the app, refund processes within 5 business days.' },
      { when: 'After day 14', body: 'Cancel anytime. Message Luke in the app with CANCEL. Confirmation within 24 hours. Billing stops on your next charge date.' },
    ],
    consent: (
      <>I understand {PRODUCT_NAME} is billed at <b style={{ color: T.ink }}>$197/month with no minimum commitment</b>. I have 14 days to request a full refund. After that, I can cancel anytime.</>
    ),
  },
  sixmonth: {
    bullets: [
      'A one-time payment of $997 for 6 months',
      'Charged in full today, no recurring billing',
      'Your first 14 days are covered by our money-back guarantee',
      'After day 14, your payment is refundable at Luke\'s discretion',
      'Nothing recurring to cancel, your program simply runs its course',
    ],
    cancellation: [
      { when: 'Within your first 14 days', body: 'Full refund guarantee. Message Luke in the app, refund processes within 5 business days.' },
      { when: 'After day 14', body: 'Your payment is refundable at Luke\'s discretion.' },
      { when: 'At the end of your 6 months', body: 'Your program ends automatically. Nothing renews or charges again unless you choose to continue.' },
    ],
    consent: (
      <>I understand {PRODUCT_NAME} is a <b style={{ color: T.ink }}>one-time payment of $997 for 6 months</b>. I have 14 days to request a full refund. After day 14, this payment is refundable only at Luke's discretion.</>
    ),
  },
}

/* Fires the gate answers to the shared lead-capture endpoint, pass or fail,
   so every applicant lands in the sheet — just tagged qualified/unqualified. */
function submitGateLead(answers, qualified) {
  try {
    let lead = {}
    try { lead = (JSON.parse(sessionStorage.getItem('chainmover_results') || '{}').lead) || {} } catch (_) { /* no lead */ }
    const params = new URLSearchParams({
      form:                    'buy_gate',
      name:                    lead.name || '',
      email:                   lead.email || '',
      phone:                   lead.phone || '',
      instagram:               lead.instagram || '',
      source:                  lead.source || '',
      bucket:                  lead.bucket || '',
      follow_plan:             answers.follow_plan || '',
      honest_conversations:    answers.honest_conversations || '',
      pushed_outside_comfort:  answers.pushed_outside_comfort || '',
      start_timeline:          answers.start_timeline || '',
      qualified:               qualified ? 'true' : 'false',
      timestamp:               new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    })
    fetch(`${APPS_SCRIPT_URL}?${params}`, { mode: 'no-cors' })
  } catch (_) { /* silent fail — never block the gate result */ }
}

function GateOption({ selected, label, onClick }) {
  return (
    <button type="button" className={`gate-opt${selected ? ' sel' : ''}`} onClick={onClick}>
      {label}
    </button>
  )
}

/* Fit-screening gate (right column, shown before Checkout). */
function Gate({ onComplete }) {
  const [answers, setAnswers] = useState({})
  const allAnswered = GATE_QUESTIONS.every(q => answers[q.id])

  const submit = () => {
    if (!allAnswered) return
    const qualified = GATE_QUESTIONS.every(q => !q.failValues.includes(answers[q.id]))
    submitGateLead(answers, qualified)
    onComplete(qualified)
  }

  return (
    <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 22, padding: 'clamp(28px,4vw,44px)', boxShadow: T.shadow }}>
      <span className="eyebrow">Before you start</span>
      <h3 style={{ fontSize: 'clamp(22px,2.4vw,28px)', marginTop: 12, marginBottom: 8 }}>A few quick questions.</h3>
      <p style={{ fontSize: 14.5, color: T.inkSoft, lineHeight: 1.6, marginBottom: 28 }}>
        {PRODUCT_NAME} works from any starting point. It only has one real requirement: you follow it exactly as built, no swaps, no second-guessing. Answer honestly so we can confirm that is you before you enroll.
      </p>

      {GATE_QUESTIONS.map((q, i) => (
        <div key={q.id} style={{ marginBottom: 26 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11.5, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkFaint, marginBottom: 8 }}>
            Question {i + 1} of {GATE_QUESTIONS.length}
          </div>
          <h4 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 16.5, lineHeight: 1.35, color: T.ink, margin: '0 0 12px' }}>
            {q.q}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map(opt => (
              <GateOption
                key={opt.value}
                selected={answers[q.id] === opt.value}
                label={opt.label}
                onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.value }))}
              />
            ))}
          </div>
        </div>
      ))}

      <button type="button" className="cta cta-primary" disabled={!allAnswered} onClick={submit}>
        Continue
      </button>
      {!allAnswered && (
        <p style={{ marginTop: 12, fontSize: 13, color: T.inkFaint, textAlign: 'center' }}>Answer all questions above to continue.</p>
      )}
    </div>
  )
}

/* Shown when the gate answers indicate a poor fit. Hard block — no path
   back to checkout or a call, just a respectful no. */
function Blocked() {
  return (
    <Wrap style={{ paddingBlock: 'clamp(64px,10vw,120px)', maxWidth: 640, textAlign: 'center' }}>
      <span className="eyebrow">Application result</span>
      <h1 style={{ fontSize: 'clamp(28px,3.6vw,40px)', marginTop: 14 }}>This is not the right fit right now.</h1>
      <p style={{ marginTop: 18, fontSize: 16, color: T.inkSoft, lineHeight: 1.65 }}>
        Based on your answers, {PRODUCT_NAME} is not a match for where you are at today. It only works if you are ready to follow it exactly as built, and it would not be fair to either of us to start something you are not ready for.
      </p>
      <Link
        to="/landing"
        className="cta"
        style={{ marginTop: 32, display: 'inline-flex', width: 'auto', paddingInline: 36, background: T.line, color: T.ink }}
      >
        Back to home
      </Link>
    </Wrap>
  )
}

/* Checkout (right) */
function Checkout() {
  const [plan, setPlan] = useState('sixmonth')
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedCancellation, setAgreedCancellation] = useState(false)

  const url = plan === 'monthly' ? CHECKOUT_MONTHLY_URL : CHECKOUT_SIXMONTH_URL
  const ctaLabel = plan === 'monthly' ? 'Start Now, $197 a month' : 'Start Now, $997 for 6 months'
  const terms = PLAN_TERMS[plan]

  const selectPlan = (next) => {
    setPlan(next)
    setAgreedTerms(false)
    setAgreedCancellation(false)
  }

  const handleEnroll = () => {
    if (!agreedTerms || !agreedCancellation) return
    if (url.startsWith('http')) {
      window.location.href = url
    } else {
      alert('Test mode: paste your checkout URL into the constants at the top of BuyPage.jsx to enable live checkout.')
    }
  }

  return (
    <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 22, padding: 'clamp(28px,4vw,44px)', boxShadow: T.shadow }}>
      <span className="eyebrow">Choose your start</span>
      <h3 style={{ fontSize: 'clamp(22px,2.4vw,28px)', marginTop: 12, marginBottom: 20 }}>Pick a plan, then start.</h3>

      {/* plan selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button type="button" className={`plan${plan === 'monthly' ? ' sel' : ''}`} onClick={() => selectPlan('monthly')}>
          <span className="dot" />
          <span style={{ flex: 1 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <b style={{ fontFamily: T.display, fontSize: 19, color: T.ink }}>$197 a month</b>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.moss }}>Cancel anytime</span>
            </span>
            <span style={{ display: 'block', marginTop: 6, fontSize: 14, color: T.inkSoft, lineHeight: 1.5 }}>Billed monthly, cancel anytime.</span>
          </span>
        </button>

        <button type="button" className={`plan${plan === 'sixmonth' ? ' sel' : ''}`} onClick={() => selectPlan('sixmonth')}>
          <span className="dot" />
          <span style={{ flex: 1 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <b style={{ fontFamily: T.display, fontSize: 19, color: T.ink }}>$997 for 6 months</b>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.forest600 }}>Save $185</span>
            </span>
            <span style={{ display: 'block', marginTop: 6, fontSize: 14, color: T.inkSoft, lineHeight: 1.5 }}>Paid once. About $166 a month.</span>
          </span>
        </button>
      </div>

      {/* TOS section */}
      <div style={{ marginTop: 26, background: T.bone, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px 24px' }}>
        <h4 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, color: T.ink, margin: '0 0 14px' }}>Enrollment terms</h4>
        <p style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.65, margin: 0, marginBottom: 14 }}>By signing up for {PRODUCT_NAME}, you agree to:</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {terms.bullets.map(b => (
            <li key={b} style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, color: T.vital, fontWeight: 600 }}>•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <h4 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, color: T.ink, margin: '18px 0 12px' }}>Cancellation terms</h4>
        <div style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.7 }}>
          {terms.cancellation.map((c, i) => (
            <div key={c.when} style={{ marginBottom: i < terms.cancellation.length - 1 ? 12 : 0 }}>
              <b style={{ color: T.ink }}>{c.when}:</b>
              <p style={{ margin: '4px 0 0' }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* consent checkboxes */}
      <label className={`agree${agreedTerms ? ' checked' : ''}`} style={{ marginTop: 18 }}>
        <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} />
        <span>{terms.consent}</span>
      </label>

      <label className={`agree${agreedCancellation ? ' checked' : ''}`} style={{ marginTop: 12 }}>
        <input type="checkbox" checked={agreedCancellation} onChange={e => setAgreedCancellation(e.target.checked)} />
        <span>
          I have read and agree to the Cancellation Terms above.
        </span>
      </label>

      {/* CTA */}
      <button className="cta cta-primary" style={{ marginTop: 22 }} disabled={!agreedTerms || !agreedCancellation} onClick={handleEnroll}>
        {ctaLabel}
      </button>
      {(!agreedTerms || !agreedCancellation) && (
        <p style={{ marginTop: 12, fontSize: 13, color: T.inkFaint, textAlign: 'center' }}>Check both boxes above to start.</p>
      )}

      {/* guarantee restated */}
      <p style={{ marginTop: 18, textAlign: 'center', fontSize: 14, color: T.inkSoft, lineHeight: 1.6 }}>
        14 days. Do the check ins. If it is not for you, get every dollar back.
      </p>

      {/* after the yes */}
      <p style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${T.lineSoft}`, textAlign: 'center', fontSize: 14, color: T.inkFaint, lineHeight: 1.6 }}>
        The system flags your first week automatically, and Luke reviews it personally.
      </p>

      {/* trust row */}
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', color: T.inkFaint, fontFamily: T.mono, fontSize: 11.5, letterSpacing: '.04em' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Secure checkout
        </span>
        <span>Payments by HubFit</span>
      </div>
    </div>
  )
}

const AFTER = [
  { when: 'The moment you join', body: 'You get instant access to your training app and a few short intake forms, so the system can build Day 1 of your Blueprint around your real life. You are welcomed into the private client community right away.' },
  { when: 'Within 24 hours of your forms', body: 'Your Blueprint is built and ready: a full nutrition and training plan, plus a walkthrough of the app and how to reach support between check ins.' },
  { when: 'Saturday', body: 'Your first check in. Luke reviews how your week went inside the system.' },
  { when: 'Sunday', body: 'Your first round of adjustments lands. You know exactly what to do next.' },
]

function AfterJoin() {
  return (
    <Wrap style={{ paddingBottom: 'clamp(40px,6vw,72px)', maxWidth: 760 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <span className="eyebrow">What happens after you join</span>
        <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', marginTop: 12 }}>The guessing stops the day you join.</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {AFTER.map((a, i) => (
          <div key={i} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.moss, letterSpacing: '.06em', textTransform: 'uppercase' }}>{a.when}</div>
            <p style={{ marginTop: 8, fontSize: 15, color: T.ink, lineHeight: 1.6 }}>{a.body}</p>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 20, textAlign: 'center', fontSize: 15.5, color: T.inkSoft, lineHeight: 1.65 }}>
        By this time tomorrow you are not guessing anymore. You are finally feeling on track and certain about where your health is going.
      </p>
    </Wrap>
  )
}

const BUY_FAQS = [
  { q: 'What are my payment options?', a: "$197 a month, cancel anytime. Or $997 once for 6 months, about $166 a month and $185 cheaper than paying monthly." },
  { q: 'Can I cancel?', a: "Yes, anytime. Message me in the app and it is handled. No cancel wall, no runaround." },
  { q: 'What if it is not for me?', a: "You have 14 days. Do the check ins and follow the week 1 plan. If it is not for you, message me and get every dollar back. No forms, no runaround." },
  { q: 'What happens if I fall off track one week?', a: "You will have a bad week. That is week 4, not failure. Every man hits it. You will not be doing it alone, that is exactly when I step in." },
]

function FAQ() {
  return (
    <Wrap style={{ paddingBottom: 'clamp(40px,6vw,72px)', maxWidth: 720 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <span className="eyebrow">Questions</span>
        <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', marginTop: 12 }}>Straight answers.</h2>
      </div>
      <div>
        {BUY_FAQS.map((f, i) => (
          <details key={i} className="faq" open={i === 0}>
            <summary>{f.q}<span className="ico" /></summary>
            <div className="ans">{f.a}</div>
          </details>
        ))}
      </div>
    </Wrap>
  )
}

function YourChoice() {
  return (
    <section style={{ background: T.forest, color: '#fff' }}>
      <Wrap style={{ paddingBlock: 'clamp(48px,6vw,80px)', maxWidth: 640, textAlign: 'center' }}>
        <span className="eyebrow" style={{ color: T.vital }}>Your choice</span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(26px,3.4vw,38px)', marginTop: 14 }}>You have done harder things than this.</h2>
        <p style={{ marginTop: 18, fontSize: 'clamp(16px,1.5vw,19px)', color: 'rgba(255,255,255,.86)', lineHeight: 1.65 }}>
          You build systems for everything else in your life, and you win. Your health just never had one. That is the only thing that has been missing.
        </p>
        <p style={{ marginTop: 14, fontSize: 'clamp(16px,1.5vw,19px)', color: '#fff', fontWeight: 600, lineHeight: 1.6 }}>
          The system is ready when you are. The choice is yours.
        </p>
      </Wrap>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: T.ink, color: '#fff', paddingBlock: 40, marginTop: 8 }}>
      <Wrap>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.display, fontWeight: 800, fontSize: 17 }}>
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
            Chainmover Fitness
          </div>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 12.5, maxWidth: 520, lineHeight: 1.55 }}>
            © 2026 Chainmover Fitness. Coaching, not medical advice.
          </span>
        </div>
      </Wrap>
    </footer>
  )
}

export default function BuyPage() {
  useFonts()
  const [phase, setPhase] = useState('gate') // 'gate' | 'checkout' | 'blocked'

  return (
    <div className="mroi-buy">
      <style>{CSS}</style>
      <Header />
      <main>
        {phase === 'blocked' ? (
          <Blocked />
        ) : (
          <>
            <Wrap style={{ paddingBlock: 'clamp(36px,5vw,64px)' }}>
              <div style={{ maxWidth: 680, marginBottom: 40 }}>
                <span className="eyebrow">Start</span>
                <h1 style={{ fontSize: 'clamp(30px,4.2vw,46px)', marginTop: 14 }}>Start {PRODUCT_NAME}.</h1>
                <p style={{ marginTop: 16, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft, lineHeight: 1.6 }}>
                  {phase === 'gate'
                    ? 'A few quick questions first, so we can make sure this is the right fit before you enroll.'
                    : 'You already know what the Blueprint does. Pick your plan and start following it. Your first 14 days are covered by the refund, so the risk is on me.'}
                </p>
              </div>

              <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 'clamp(24px,3vw,40px)', alignItems: 'start' }}>
                <Summary />
                {phase === 'gate'
                  ? <Gate onComplete={qualified => setPhase(qualified ? 'checkout' : 'blocked')} />
                  : <Checkout />}
              </div>
            </Wrap>
            <AfterJoin />
            <FAQ />
            <YourChoice />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
