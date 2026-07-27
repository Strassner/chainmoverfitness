import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'

/* ══════════════════════════════════════════════════════════════════════
   ISOLATED TEST ROUTE — /buy  (Checkout & Offer page)
   Fully self-contained. All styles scoped under `.mroi-buy`. Nothing here
   touches or imports the live site's routes, components, or globals.
   ══════════════════════════════════════════════════════════════════════ */

/* ─── Payment links — swap these for your real Stripe Checkout URLs ────
   Leave as-is to run in placeholder mode (button explains it's a test).  */
const STRIPE_WEEKLY_URL = 'PASTE_STRIPE_WEEKLY_CHECKOUT_URL'
const STRIPE_PIF_URL    = 'PASTE_STRIPE_PAY_IN_FULL_CHECKOUT_URL'

/* ─── Brand tokens (local copy — no shared import) ─────────────────── */
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

/* ─── Scoped CSS (everything under `.mroi-buy`, zero global leak) ───── */
const CSS = `
  .mroi-buy * { box-sizing: border-box; }
  .mroi-buy { font-family: ${T.body}; color: ${T.ink}; background: ${T.bone}; min-height: 100svh; font-size: 17px; line-height: 1.6; letter-spacing: -0.005em; }
  .mroi-buy h1,.mroi-buy h2,.mroi-buy h3,.mroi-buy h4 { font-family: ${T.display}; font-weight: 800; line-height: 1.08; letter-spacing: -0.025em; margin: 0; color: ${T.ink}; }
  .mroi-buy p { margin: 0; }
  .mroi-buy a { color: inherit; text-decoration: none; }
  .mroi-buy img { max-width: 100%; display: block; }

  .mroi-buy .eyebrow { font-family: ${T.mono}; font-size: 12px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: ${T.moss}; display: inline-flex; align-items: center; gap: 10px; }
  .mroi-buy .eyebrow.vital { color: ${T.vital}; }

  .mroi-buy .cta { display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; font-family: ${T.body}; font-weight: 700; font-size: 18px; padding: 20px 28px; border-radius: 100px; border: none; cursor: pointer; transition: transform .18s ease, box-shadow .2s ease, background .2s, opacity .2s; letter-spacing: -0.01em; }
  .mroi-buy .cta-primary { background: ${T.vital}; color: ${T.forest}; box-shadow: 0 10px 26px rgba(70,201,139,.36); }
  .mroi-buy .cta-primary:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(70,201,139,.46); }
  .mroi-buy .cta:disabled { background: ${T.line}; color: ${T.inkFaint}; cursor: not-allowed; box-shadow: none; }
  .mroi-buy .cta:not(:disabled):active { transform: translateY(1px); }

  .mroi-buy .pif { display: block; width: 100%; text-align: center; margin-top: 14px; padding: 15px 20px; border: 1.5px solid ${T.line}; border-radius: 100px; background: ${T.paper}; font-weight: 600; font-size: 15.5px; color: ${T.ink}; cursor: pointer; transition: border-color .2s, color .2s; }
  .mroi-buy .pif:hover { border-color: ${T.forest}; color: ${T.forest}; }
  .mroi-buy .pif b { color: ${T.forest600}; }

  .mroi-buy .agree { display: flex; gap: 13px; align-items: flex-start; padding: 18px; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.bone}; cursor: pointer; transition: border-color .2s, background .2s; }
  .mroi-buy .agree:hover { border-color: ${T.moss}; }
  .mroi-buy .agree.checked { border-color: ${T.vital}; background: ${T.mist}; }
  .mroi-buy .agree input { width: 22px; height: 22px; margin: 1px 0 0; accent-color: ${T.forest}; flex-shrink: 0; cursor: pointer; }
  .mroi-buy .agree span { font-size: 14.5px; line-height: 1.55; color: ${T.inkSoft}; }

  .mroi-buy .faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 20px 0; font-family: ${T.display}; font-weight: 700; font-size: 16px; color: ${T.ink}; border-top: 1px solid ${T.line}; user-select: none; }
  .mroi-buy .faq summary::-webkit-details-marker { display: none; }
  .mroi-buy .faq summary .ico::after { content: "+"; font-size: 22px; font-weight: 400; color: ${T.moss}; transition: transform .25s; display: inline-block; }
  .mroi-buy .faq[open] summary .ico::after { transform: rotate(45deg); }
  .mroi-buy .faq .ans { padding: 0 0 20px; font-size: 15px; color: ${T.inkSoft}; line-height: 1.65; }

  @media (max-width: 900px) { .mroi-buy .checkout-grid { grid-template-columns: 1fr !important; } .mroi-buy .summary-col { position: static !important; } .mroi-buy .onboard-grid { grid-template-columns: 1fr 1fr !important; } }
  @media (max-width: 560px) { .mroi-buy .onboard-grid { grid-template-columns: 1fr !important; } }
`

function Wrap({ children, style }) {
  return <div style={{ maxWidth: 1080, margin: '0 auto', paddingInline: 'clamp(20px,5vw,56px)', ...style }}>{children}</div>
}

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 15, height: 15, color: T.vital, flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* ─── Header ───────────────────────────────────────────────────────── */
function Header() {
  return (
    <header style={{ background: T.paper, borderBottom: `1px solid ${T.lineSoft}` }}>
      <Wrap>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70, gap: 16 }}>
          <Link to="/landing" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: T.ink }}>Chainmover</span>
          </Link>
          <Link to="/landing" style={{ fontFamily: T.mono, fontSize: 12.5, letterSpacing: '.04em', color: T.inkSoft, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            ← Back to overview
          </Link>
        </div>
      </Wrap>
    </header>
  )
}

/* ─── Order summary (left / sticky) ────────────────────────────────── */
const INCLUDED = [
  'Guided app onboarding — your full protocol set up in your first days',
  'Custom Training & Nutrition App access for the entire program',
  'Direct 1-on-1 accountability from Luke, with plan adjustments as needed',
  'The Exclusive M.R.O.I. Video Vault & Resource System',
  'No forced weekly Zoom calls — direct access to Luke when you need him',
]

function Summary() {
  return (
    <div className="summary-col" style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
      <div style={{ background: T.forest, color: '#fff', borderRadius: 22, padding: 'clamp(28px,3.5vw,40px)', position: 'relative', overflow: 'hidden', boxShadow: T.shadowLg }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(70,201,139,.2),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow vital">Your enrollment</span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(24px,2.8vw,32px)', marginTop: 14 }}>The 90-Day M.R.O.I. Protocol™</h2>

          {/* price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 22 }}>
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 54, letterSpacing: '-0.03em', lineHeight: 1 }}>$75</span>
            <span style={{ fontFamily: T.mono, fontSize: 15, color: 'rgba(255,255,255,.7)' }}>/ week</span>
          </div>
          <p style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,.82)', lineHeight: 1.55 }}>
            That's about <strong style={{ color: '#fff' }}>$11 a day</strong> — less than the takeout that's keeping the weight on.
          </p>
          <p style={{ marginTop: 10, fontSize: 14, color: 'rgba(255,255,255,.66)', lineHeight: 1.55 }}>
            The same 1-on-1 protocol runs <strong style={{ color: '#fff' }}>$3,000–$5,000</strong> with an in-person coach. Same system, without the overhead — or the standing weekly appointment.
          </p>

          {/* commitment badge */}
          <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(70,201,139,.16)', border: '1px solid rgba(70,201,139,.4)', color: T.vital, borderRadius: 100, padding: '8px 15px', fontFamily: T.mono, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Required 90-Day Commitment
          </div>
          <p style={{ marginTop: 14, fontSize: 14.5, color: 'rgba(255,255,255,.72)', lineHeight: 1.6 }}>
            $975 total for your 90 days, billed weekly at $75 (13 payments).
          </p>
          <p style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,.72)', lineHeight: 1.6 }}>
            <strong style={{ color: '#fff' }}>Why 90 days?</strong> The scale actually moves in the first few days — that part's fast. What takes 90 days is rewiring the <strong style={{ color: '#fff' }}>habits and the lifestyle</strong> so it's permanent, not another thing that snaps back. You can only live with the old habits for so long, and the longer you carry them the harder they are to break — never easier. That's exactly why I coach this way, and the reputation behind it.
          </p>

          {/* included */}
          <ul style={{ listStyle: 'none', margin: '26px 0 0', padding: '24px 0 0', borderTop: '1px solid rgba(255,255,255,.14)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {INCLUDED.map(item => (
              <li key={item} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 14.5, color: 'rgba(255,255,255,.9)', lineHeight: 1.5 }}>
                {CHECK}{item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* risk reversal */}
      <div style={{ marginTop: 20, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 18, padding: '24px 26px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', border: `2px solid ${T.vitalSoft}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={T.forest} strokeWidth="2" style={{ width: 24, height: 24 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <div>
          <b style={{ fontFamily: T.display, fontSize: 17, color: T.ink, display: 'block' }}>The 90-Day Outcome Guarantee</b>
          <p style={{ marginTop: 8, fontSize: 14.5, color: T.inkSoft, lineHeight: 1.6 }}>
            Follow the protocol at 80% compliance for your full 90 days. If the scale hasn't moved, Luke keeps coaching you 1-on-1 at <strong style={{ color: T.ink }}>no additional cost</strong> until it does. You do the work; the risk is his.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Checkout (right) ─────────────────────────────────────────────── */
function Checkout() {
  const [agreed, setAgreed] = useState(false)

  const handleEnroll = () => {
    if (!agreed) return
    if (STRIPE_WEEKLY_URL.startsWith('http')) {
      window.location.href = STRIPE_WEEKLY_URL
    } else {
      alert('Test mode: paste your Stripe weekly Checkout URL into STRIPE_WEEKLY_URL at the top of BuyPage.jsx to enable live checkout.')
    }
  }

  const handlePif = (e) => {
    e.preventDefault()
    if (STRIPE_PIF_URL.startsWith('http')) {
      window.location.href = STRIPE_PIF_URL
    } else {
      alert('Test mode: paste your Stripe pay-in-full Checkout URL into STRIPE_PIF_URL at the top of BuyPage.jsx to enable live checkout.')
    }
  }

  return (
    <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 22, padding: 'clamp(28px,4vw,44px)', boxShadow: T.shadow }}>
      <span className="eyebrow">Checkout</span>
      <h3 style={{ fontSize: 'clamp(22px,2.4vw,28px)', marginTop: 14 }}>Confirm your commitment, then enroll.</h3>
      <p style={{ marginTop: 14, fontSize: 15.5, color: T.inkSoft, lineHeight: 1.6 }}>
        You're one step from starting. Review the terms below, check the box to confirm you understand the 90-day structure, and complete your enrollment.
      </p>

      {/* cancellation transparency — answer the #1 fear before it's asked */}
      <div style={{ marginTop: 26, display: 'flex', gap: 13, alignItems: 'flex-start', padding: '18px', borderRadius: 14, background: T.mist, border: `1px solid ${T.vitalSoft}` }}>
        <span style={{ color: T.forest, marginTop: 1 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></svg>
        </span>
        <div>
          <b style={{ fontFamily: T.display, fontSize: 15.5, color: T.ink, display: 'block' }}>Cancelling is one email — no hoops.</b>
          <p style={{ marginTop: 6, fontSize: 14, color: T.inkSoft, lineHeight: 1.55 }}>
            After your 90 days, cancel anytime by replying to any email or messaging Luke in the app. No phone call, no "retention specialist," no fine print, no waiting on hold. The lock-in is 90 days and not a day more.
          </p>
        </div>
      </div>

      {/* mandatory agreement */}
      <label className={`agree${agreed ? ' checked' : ''}`} style={{ marginTop: 16 }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <span>
          I understand that the M.R.O.I. Protocol requires a minimum <b style={{ color: T.ink }}>90-day commitment</b> ($75/week, billed weekly) before auto-renewing week-to-week, which I can cancel anytime after that.
        </span>
      </label>

      {/* primary CTA */}
      <button className="cta cta-primary" style={{ marginTop: 22 }} disabled={!agreed} onClick={handleEnroll}>
        Complete Enrolment ($75/wk)
      </button>
      {!agreed && (
        <p style={{ marginTop: 12, fontSize: 13, color: T.inkFaint, textAlign: 'center' }}>
          Check the box above to enable enrollment.
        </p>
      )}

      {/* prepay tier */}
      <button className="pif" onClick={handlePif}>
        Go all-in: <b>6 Months Upfront for $1,497</b> <span style={{ color: T.inkFaint, fontWeight: 500 }}>— $1,950 → $1,497, save $453</span>
      </button>

      {/* proof at the button — last thing before they click */}
      <blockquote style={{ margin: '22px 0 0', background: T.bone, border: `1px solid ${T.line}`, borderRadius: 14, padding: '18px 20px' }}>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: T.ink, fontStyle: 'italic' }}>
          “Other coaches felt like I got handed off to a stranger. With Luke I actually get Luke. If I don't have enough communication it doesn't work for me — and this works.”
        </p>
        <footer style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <b style={{ fontFamily: T.display, fontSize: 14.5, color: T.ink }}>Larry</b>
          <span style={{ fontFamily: T.mono, fontSize: 12, color: T.moss }}>Down 40 lbs in 5 months</span>
        </footer>
      </blockquote>

      {/* trust row */}
      <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, flexWrap: 'wrap', color: T.inkFaint, fontFamily: T.mono, fontSize: 11.5, letterSpacing: '.04em' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Secure checkout
        </span>
        <span>·</span>
        <span>Payments processed by Stripe</span>
        <span>·</span>
        <span>Cancel anytime after 90 days</span>
      </div>
    </div>
  )
}

/* ─── "The moment you enroll" onboarding roadmap ───────────────────── */
const ONBOARD = [
  { n: '01', title: 'The next 5 minutes', body: 'You enroll and get instant access to your onboarding. No waiting for a call to be scheduled — you start now, while you\'re sure.' },
  { n: '02', title: 'First 48 hours', body: "You fill out a short intake — your history, your schedule, your goals, any injuries or foods you hate. Luke uses it to build around your real life, not a template." },
  { n: '03', title: 'Your plan goes live', body: 'Your training and nutrition are set up in the app. You open it and know exactly what to do that day — the decision fatigue is gone.' },
  { n: '04', title: 'Luke\'s in your corner', body: "From day one you've got direct 1-on-1 accountability — he tracks your progress, keeps you on track, and adjusts as needed. You're never doing this alone." },
]

function Onboarding() {
  return (
    <div style={{ marginTop: 'clamp(40px,5vw,64px)' }}>
      <div style={{ maxWidth: 640, marginBottom: 32 }}>
        <span className="eyebrow">The moment you enroll</span>
        <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', marginTop: 14 }}>Here's exactly what happens next.</h2>
        <p style={{ marginTop: 14, fontSize: 16, color: T.inkSoft, lineHeight: 1.6 }}>
          No mystery, no "we'll be in touch." The structure starts the second you're in.
        </p>
      </div>
      <div className="onboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        {ONBOARD.map(o => (
          <div key={o.n} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px 22px 24px' }}>
            <div style={{ fontFamily: T.mono, fontSize: 12.5, color: T.moss, letterSpacing: '.12em' }}>{o.n}</div>
            <h3 style={{ fontSize: 17, marginTop: 12 }}>{o.title}</h3>
            <p style={{ marginTop: 10, fontSize: 14, color: T.inkSoft, lineHeight: 1.6 }}>{o.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Objection-crusher FAQ (the "think about it" killer) ──────────── */
const OBJECTIONS = [
  { q: "I want to think about it / talk to my partner first.", a: "Totally fair — but be honest about what you'd actually be thinking about. The system, the coach, and the guarantee are all right here on this page; there's nothing new to learn by waiting. \"Thinking about it\" is usually just the old habit choosing comfort for one more week. It costs $11 a day, the risk is on Luke, and you can cancel after 90 days in one email. If it's a fit, the move is to start while you're sure." },
  { q: "What if it doesn't work for me?", a: "Then Luke keeps coaching you for free. Follow the protocol at 80% compliance for your 90 days and if the scale hasn't moved, he works with you 1-on-1 at no additional cost until it does. You carry the effort; he carries the risk." },
  { q: "What if I fall off or can't keep up?", a: "That's the whole reason the accountability exists. When you slip, Luke notices and pulls you back — that's the difference between this and every plan you quietly quit. And the program is built around a busy life, not the other way around." },
  { q: "Why the 90-day minimum?", a: "Because the scale moves in days, but making the change permanent — rewiring the habits and lifestyle so it doesn't snap back — takes about 90. The minimum keeps you in long enough to actually get the result you're paying for, not to trap you. Cancel anytime after." },
  { q: "Is my payment secure?", a: "Yes. All payments are processed by Stripe — Luke never sees your card details. You'll enter them on Stripe's own secure checkout." },
]

function ObjectionFaq() {
  return (
    <div style={{ marginTop: 'clamp(40px,5vw,64px)', maxWidth: 760 }}>
      <span className="eyebrow">Before you close the tab</span>
      <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', marginTop: 14, marginBottom: 8 }}>The honest answers to what you're thinking.</h2>
      <div style={{ marginTop: 20 }}>
        {OBJECTIONS.map((o, i) => (
          <details key={i} className="faq" open={i === 0}>
            <summary>{o.q}<span className="ico" /></summary>
            <div className="ans">{o.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}

/* ─── Footer ───────────────────────────────────────────────────────── */
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
            © 2026 Chainmover Fitness. The M.R.O.I. Protocol™ is a coaching program, not medical advice. Guarantee terms require full adherence to the prescribed protocol.
          </span>
        </div>
      </Wrap>
    </footer>
  )
}

/* ─── Root ─────────────────────────────────────────────────────────── */
export default function BuyPage() {
  useFonts()
  return (
    <div className="mroi-buy">
      <style>{CSS}</style>
      <Header />
      <main>
        <Wrap style={{ paddingBlock: 'clamp(36px,5vw,64px)' }}>
          <div style={{ maxWidth: 700, marginBottom: 40 }}>
            <span className="eyebrow">Final step</span>
            <h1 style={{ fontSize: 'clamp(30px,4.2vw,48px)', marginTop: 16 }}>Secure Your Spot in the 90-Day M.R.O.I. Protocol</h1>
            <p style={{ marginTop: 18, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft, lineHeight: 1.6 }}>
              You already know why — you've seen how the system works and who's coaching you. This is the how. Everything below is exactly what you get, what you're agreeing to, and what happens the moment you enroll. No call to book, no waiting — the men who get this done are the ones who start while they're sure.
            </p>
          </div>

          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 'clamp(24px,3vw,40px)', alignItems: 'start' }}>
            <Summary />
            <Checkout />
          </div>

          <Onboarding />
          <ObjectionFaq />
        </Wrap>
      </main>
      <Footer />
    </div>
  )
}
