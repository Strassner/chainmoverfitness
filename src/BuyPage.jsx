import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'

/* ══════════════════════════════════════════════════════════════════════
   ISOLATED TEST ROUTE — /buy  (lean checkout, no application)
   Fully self-contained. All styles scoped under `.mroi-buy`.
   ══════════════════════════════════════════════════════════════════════ */

/* Payment links — swap for your real Stripe Checkout URLs. */
const STRIPE_WEEKLY_URL   = 'PASTE_STRIPE_WEEKLY_CHECKOUT_URL'
const STRIPE_SIXMONTH_URL = 'PASTE_STRIPE_SIXMONTH_CHECKOUT_URL'

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

  .mroi-buy .agree { display: flex; gap: 13px; align-items: flex-start; padding: 18px; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.bone}; cursor: pointer; transition: border-color .2s, background .2s; }
  .mroi-buy .agree:hover { border-color: ${T.moss}; }
  .mroi-buy .agree.checked { border-color: ${T.vital}; background: ${T.mist}; }
  .mroi-buy .agree input { width: 22px; height: 22px; margin: 1px 0 0; accent-color: ${T.forest}; flex-shrink: 0; cursor: pointer; }
  .mroi-buy .agree span { font-size: 14.5px; line-height: 1.55; color: ${T.inkSoft}; }

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
  'Your M.R.O.I. Phase Plans, a custom nutrition plan for each phase',
  'The Busy-Man Training Plan, built around the equipment you have',
  'Weekly adjustments based on your schedule and how your body responded',
  'Course correction from Luke, he pulls you back the day you drift',
  'One app for your plan, your food, and your numbers',
  'A room of guys on the same journey, going through it at the same time',
]

function Header() {
  return (
    <header style={{ background: T.paper, borderBottom: `1px solid ${T.lineSoft}` }}>
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
        <span className="eyebrow" style={{ color: T.vital }}>Your enrollment</span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(24px,2.8vw,32px)', marginTop: 12 }}>The M.R.O.I. Protocol</h2>
        <p style={{ marginTop: 14, fontSize: 15, color: 'rgba(255,255,255,.78)', lineHeight: 1.6 }}>
          Coaching for men who are done starting over. Every check in comes from Luke himself, not a sub coach.
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

/* Checkout (right) */
function Checkout() {
  const [plan, setPlan] = useState('sixmonth')
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedCancellation, setAgreedCancellation] = useState(false)

  const url = plan === 'weekly' ? STRIPE_WEEKLY_URL : STRIPE_SIXMONTH_URL
  const ctaLabel = plan === 'weekly' ? 'Start Now, $75 a week' : 'Start Now, $1,297 for 6 months'

  const handleEnroll = () => {
    if (!agreedTerms || !agreedCancellation) return
    if (url.startsWith('http')) {
      window.location.href = url
    } else {
      alert('Test mode: paste your Stripe Checkout URL into the constants at the top of BuyPage.jsx to enable live checkout.')
    }
  }

  return (
    <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 22, padding: 'clamp(28px,4vw,44px)', boxShadow: T.shadow }}>
      <span className="eyebrow">Choose your start</span>
      <h3 style={{ fontSize: 'clamp(22px,2.4vw,28px)', marginTop: 12, marginBottom: 20 }}>Pick a plan, then start.</h3>

      {/* plan selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button type="button" className={`plan${plan === 'weekly' ? ' sel' : ''}`} onClick={() => setPlan('weekly')}>
          <span className="dot" />
          <span style={{ flex: 1 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <b style={{ fontFamily: T.display, fontSize: 19, color: T.ink }}>$75 a week</b>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.moss }}>3 month commitment</span>
            </span>
            <span style={{ display: 'block', marginTop: 6, fontSize: 14, color: T.inkSoft, lineHeight: 1.5 }}>Billed weekly, with a 3 month commitment. Your first 14 days are covered by the refund, so the risk is on me.</span>
          </span>
        </button>

        <button type="button" className={`plan${plan === 'sixmonth' ? ' sel' : ''}`} onClick={() => setPlan('sixmonth')}>
          <span className="dot" />
          <span style={{ flex: 1 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <b style={{ fontFamily: T.display, fontSize: 19, color: T.ink }}>$1,297 for 6 months</b>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.forest600 }}>Save $653</span>
            </span>
            <span style={{ display: 'block', marginTop: 6, fontSize: 14, color: T.inkSoft, lineHeight: 1.5 }}>Paid once. About $50 a week. A commitment you choose on purpose, not a trap.</span>
          </span>
        </button>
      </div>

      {/* TOS section */}
      <div style={{ marginTop: 26, background: T.bone, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px 24px' }}>
        <h4 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, color: T.ink, margin: '0 0 14px' }}>Enrollment terms</h4>
        <p style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.65, margin: 0, marginBottom: 14 }}>By signing up for the M.R.O.I. Protocol, you agree to:</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, color: T.vital, fontWeight: 600 }}>•</span>
            <span>A 3-month minimum commitment at $75/week</span>
          </li>
          <li style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, color: T.vital, fontWeight: 600 }}>•</span>
            <span>Weekly billing starting today</span>
          </li>
          <li style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, color: T.vital, fontWeight: 600 }}>•</span>
            <span>Your first 14 days are covered by our money-back guarantee</span>
          </li>
          <li style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, color: T.vital, fontWeight: 600 }}>•</span>
            <span>This charge is binding after day 14</span>
          </li>
          <li style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, color: T.vital, fontWeight: 600 }}>•</span>
            <span>Cancellation after your 90 days is just a message to Luke in the app</span>
          </li>
          <li style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, color: T.vital, fontWeight: 600 }}>•</span>
            <span>No forms, no runaround</span>
          </li>
        </ul>

        <h4 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, color: T.ink, margin: '18px 0 12px' }}>Cancellation terms</h4>
        <div style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.7 }}>
          <div style={{ marginBottom: 12 }}>
            <b style={{ color: T.ink }}>Within your first 14 days:</b>
            <p style={{ margin: '4px 0 0' }}>Full refund guarantee. Message Luke in the app, refund processes within 5 business days.</p>
          </div>
          <div style={{ marginBottom: 12 }}>
            <b style={{ color: T.ink }}>After day 14, during your 90 days:</b>
            <p style={{ margin: '4px 0 0' }}>You cannot cancel. This is a binding commitment you made at checkout.</p>
          </div>
          <div>
            <b style={{ color: T.ink }}>After 90 days:</b>
            <p style={{ margin: '4px 0 0' }}>Message Luke in the app with CANCEL. Confirmation within 24 hours. Billing stops on your next charge date.</p>
          </div>
        </div>
      </div>

      {/* consent checkboxes */}
      <label className={`agree${agreedTerms ? ' checked' : ''}`} style={{ marginTop: 18 }}>
        <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} />
        <span>
          I understand the M.R.O.I. Protocol is a <b style={{ color: T.ink }}>3-month commitment at $75/week</b>. I have 14 days to request a full refund. After day 14, I cannot cancel and this charge is binding.
        </span>
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
        Luke reviews your first week and reaches out personally.
      </p>

      {/* trust row */}
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', color: T.inkFaint, fontFamily: T.mono, fontSize: 11.5, letterSpacing: '.04em' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Secure checkout
        </span>
        <span>Payments by Stripe</span>
      </div>
    </div>
  )
}

const AFTER = [
  { when: 'The moment you join', body: 'You get a welcome message from me, an invite to my training app, and a few short forms so I can build your plan around your real life. You are welcomed into the client community right away.' },
  { when: 'Within 24 hours of your forms', body: 'Your first nutrition and training plan is ready. You get a full walkthrough of the app, and my personal phone number. Any question, any time, you text me.' },
  { when: 'Saturday', body: 'Your first check in. I look at how your week went.' },
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
        By this time next week you are not guessing anymore. You are finally feeling on track and certain about where your health is going. Joining creates certainty. It does not take it away.
      </p>
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
          You build systems for everything else in your life, and you win. Your health is the one place you never did. That is the only reason it is not handled yet.
        </p>
        <p style={{ marginTop: 14, fontSize: 'clamp(16px,1.5vw,19px)', color: '#fff', fontWeight: 600, lineHeight: 1.6 }}>
          If it was really a priority, you already know your next move. The choice is yours.
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
  return (
    <div className="mroi-buy">
      <style>{CSS}</style>
      <Header />
      <main>
        <Wrap style={{ paddingBlock: 'clamp(36px,5vw,64px)' }}>
          <div style={{ maxWidth: 680, marginBottom: 40 }}>
            <span className="eyebrow">Start</span>
            <h1 style={{ fontSize: 'clamp(30px,4.2vw,46px)', marginTop: 14 }}>Start the M.R.O.I. Protocol.</h1>
            <p style={{ marginTop: 16, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft, lineHeight: 1.6 }}>
              You already know what you get and who is coaching you. Pick your plan and start. Your first 14 days are covered by the refund, so the risk is on me.
            </p>
          </div>

          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 'clamp(24px,3vw,40px)', alignItems: 'start' }}>
            <Summary />
            <Checkout />
          </div>
        </Wrap>
        <AfterJoin />
        <YourChoice />
      </main>
      <Footer />
    </div>
  )
}
