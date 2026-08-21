import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import chainmoverLogo from './assets/ChainmoverLogo.png'

/* ══════════════════════════════════════════════════════════════════════
   /kit — sales page for the $27 Insulin Resistance Reset Kit (Gumroad).

   Buyer: 40–55, male or female. Suspects insulin resistance. Worried
   about ending up on medication, not anti-doctor, but unconvinced a
   prescription is the only lever. Feels nothing was ever built for them.

   TWO RULES FOR THIS PAGE:

   1. Give away nothing. The mechanism — why insulin resistance does what
      it does, and what the three steps actually are — is the product.
      This page says what is in the kit and that it works. It never
      explains how. If you find yourself adding a paragraph that teaches
      something, that paragraph belongs in the kit, not here.

   2. Keep it short. At $27 there is no long deliberation to support.
      Every extra section is another exit. Read time is the enemy.

   Single conversion goal: the Gumroad checkout.

   All styles scoped under `.mroi-kit`. Tokens match MetabolicPage.
   ══════════════════════════════════════════════════════════════════════ */

/* ?wanted=true sends Gumroad straight to checkout rather than to another
   product page the buyer has to read and decide on a second time. */
const KIT_URL = 'https://strassnerfit.gumroad.com/l/ResetKit?wanted=true'
const PRICE = '$27'
const GUARANTEE = '14-day money-back guarantee'
const APPLY_URL = '/apply?src=kit'

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
  .mroi-kit * { box-sizing: border-box; }
  .mroi-kit { font-family: ${T.body}; color: ${T.ink}; background: ${T.paper}; font-size: 18px; line-height: 1.6; letter-spacing: -0.005em; }
  .mroi-kit h1,.mroi-kit h2,.mroi-kit h3 { font-family: ${T.display}; font-weight: 800; line-height: 1.08; letter-spacing: -0.025em; margin: 0; color: ${T.ink}; }
  .mroi-kit p { margin: 0; }
  .mroi-kit a { color: inherit; text-decoration: none; }
  .mroi-kit img { max-width: 100%; display: block; }

  .mroi-kit .eyebrow { font-family: ${T.mono}; font-size: 12.5px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: ${T.moss}; display: inline-flex; align-items: center; gap: 10px; }
  .mroi-kit .eyebrow.center { justify-content: center; }
  .mroi-kit .eyebrow.vital { color: ${T.vital}; }

  .mroi-kit .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: ${T.body}; font-weight: 700; font-size: 16px; padding: 16px 30px; border-radius: 100px; border: none; cursor: pointer; transition: transform .18s ease, box-shadow .2s ease, background .2s; letter-spacing: -0.01em; }
  .mroi-kit .btn:active { transform: translateY(1px); }
  .mroi-kit .btn-vital { background: ${T.vital}; color: ${T.forest}; box-shadow: 0 8px 22px rgba(70,201,139,.32); }
  .mroi-kit .btn-vital:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(70,201,139,.42); }
  .mroi-kit .btn-lg { padding: 19px 40px; font-size: 18px; }

  .mroi-kit .faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 18px 0; font-family: ${T.display}; font-weight: 700; font-size: 16.5px; color: ${T.ink}; border-top: 1px solid ${T.line}; user-select: none; }
  .mroi-kit .faq summary::-webkit-details-marker { display: none; }
  .mroi-kit .faq summary .ico::after { content: "+"; font-size: 22px; font-weight: 400; color: ${T.moss}; transition: transform .25s; display: inline-block; }
  .mroi-kit .faq[open] summary .ico::after { transform: rotate(45deg); }
  .mroi-kit .faq .ans { padding: 0 0 18px; font-size: 15.5px; color: ${T.inkSoft}; line-height: 1.65; }

  @media (max-width: 620px) {
    .mroi-kit .symptom-grid { grid-template-columns: 1fr !important; }
  }
`

function Wrap({ children, style }) {
  return <div style={{ maxWidth: 720, margin: '0 auto', paddingInline: 'clamp(20px,5vw,44px)', ...style }}>{children}</div>
}

/* One CTA, same label and destination everywhere. */
function Buy({ note = true, style }) {
  return (
    <div style={{ ...style }}>
      <a href={KIT_URL} className="btn btn-vital btn-lg">Get the kit — {PRICE}</a>
      {note && (
        <p style={{ marginTop: 13, fontFamily: T.mono, fontSize: 12.5, color: T.inkFaint }}>
          Instant download · {GUARANTEE}
        </p>
      )}
    </div>
  )
}

function Check({ color = T.vital, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      style={{ width: size, height: size, flexShrink: 0, marginTop: 3 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ─── 1. Header + hero ─────────────────────────────────────────────── */
function Header() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.paper, borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ background: T.forest, color: '#fff', textAlign: 'center', padding: '9px 16px', fontFamily: T.mono, fontSize: 12.5, letterSpacing: '.02em' }}>
          {PRICE} · instant download · {GUARANTEE}
        </div>
        <Wrap>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, gap: 16 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={chainmoverLogo} alt="" style={{ height: 34, width: 'auto', objectFit: 'contain', display: 'block' }} />
              <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: T.ink, whiteSpace: 'nowrap' }}>Chainmover Coaching</span>
            </Link>
            <a href={KIT_URL} className="btn btn-vital" style={{ padding: '11px 22px', fontSize: 15 }}>Get the kit</a>
          </div>
        </Wrap>
      </header>

      <section style={{ background: `radial-gradient(120% 120% at 50% -10%,${T.mist} 0%,rgba(232,241,234,0) 55%),${T.paper}`, paddingTop: 'clamp(38px,5vw,68px)', paddingBottom: 'clamp(36px,4.5vw,58px)' }}>
        <Wrap style={{ textAlign: 'center' }}>
          <span className="eyebrow center" style={{ marginBottom: 16 }}>The Insulin Resistance Reset Kit</span>
          {/* Takes the blame off them, names insulin as the suspect, and
              stops. The explanation is the product. */}
          <h1 style={{ fontSize: 'clamp(38px,6.2vw,62px)' }}>It was never a willpower problem.</h1>
          <p style={{ marginTop: 18, fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(18px,2.2vw,24px)', color: T.forest, lineHeight: 1.3, letterSpacing: '-0.01em', maxWidth: 600, marginInline: 'auto' }}>
            Crashing after meals, craving sugar, carrying it around the middle? That is insulin resistance, and it does not respond to trying harder.
          </p>
          <p style={{ marginTop: 16, fontSize: 17, color: T.inkSoft, lineHeight: 1.6, maxWidth: 520, marginInline: 'auto' }}>
            Three steps. Start tomorrow morning. No medication, no calorie counting, no tracking apps.
          </p>
          <Buy style={{ marginTop: 28 }} />
        </Wrap>
      </section>
    </>
  )
}

/* ─── 2. Symptom mirror ─────────────────────────────────────────────
   Recognition, not education. Six lines, no explanation attached to
   any of them — the explanation is what they are buying. */
const SYMPTOMS = [
  'Wiped out an hour after lunch',
  'The weight sits around your middle now',
  'Hungry again ninety minutes after eating',
  'Afternoon sugar cravings you keep losing to',
  'What worked at 30 does nothing at 47',
  'Your labs came back "normal" and you did not believe it',
]

function Symptoms() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(40px,5vw,64px)' }}>
      <Wrap>
        <h2 style={{ fontSize: 'clamp(24px,3.4vw,34px)', textAlign: 'center' }}>None of this is in your head.</h2>
        <div className="symptom-grid" style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {SYMPTOMS.map(s => (
            <div key={s} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', background: T.paper, border: `1px solid ${T.line}`, borderRadius: 12, padding: '14px 16px' }}>
              <Check color={T.moss} />
              <span style={{ fontSize: 15.5, lineHeight: 1.5, color: T.ink }}>{s}</span>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── 3. Proof ──────────────────────────────────────────────────────
   Mike is a 1-on-1 coaching client, NOT a kit buyer. The attribution
   line below is not optional decoration — without it this reads as a
   claim that a $27 download moved his A1c, which it did not. Keep it
   if you edit this section. */
function Proof() {
  return (
    <section style={{ paddingBlock: 'clamp(40px,5vw,68px)' }}>
      <Wrap>
        <div style={{ background: T.forest, color: '#fff', borderRadius: 20, padding: 'clamp(26px,3.5vw,38px)', boxShadow: T.shadowLg }}>
          <span className="eyebrow vital">The marker that matters</span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(22px,2.9vw,30px)', marginTop: 12 }}>Mike reversed his Type 2 diabetes.</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px,3vw,26px)', marginTop: 22, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>A1c before</div>
              <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(36px,6vw,50px)', lineHeight: 1, color: 'rgba(255,255,255,.6)' }}>7.0</div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke={T.vital} strokeWidth="2.5" style={{ width: 28, height: 28, flexShrink: 0 }}>
              <line x1="4" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" />
            </svg>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: T.vital }}>One month later</div>
              <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(36px,6vw,50px)', lineHeight: 1, color: T.vital }}>6.3</div>
            </div>
          </div>

          <blockquote style={{ margin: '24px 0 0', fontSize: 16.5, lineHeight: 1.65, color: 'rgba(255,255,255,.9)' }}>
            “I'd been through three different doctors and two medications and nobody could tell me why the weight wouldn't move. I used to be 350. I just broke 300 for the first time without a drug doing it for me.”
            <footer style={{ marginTop: 14, fontFamily: T.mono, fontSize: 12.5, color: T.vital, fontStyle: 'normal' }}>
              Mike · retired, 55
            </footer>
          </blockquote>

          <p style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.14)', fontSize: 12.5, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
            {/* Mike is a 1-on-1 coaching client, not a Reset Kit customer — the kit is where the same approach starts, not the coaching program. Individual result, not what everyone should expect. Coaching and educational material, not medical treatment, and no medical outcome is guaranteed. */}
          </p>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── 4. What's inside ──────────────────────────────────────────────
   Names the deliverable and its format. Never the content. "What to
   drink, how to build the plate, when to walk" is the product — if it
   is on this page there is nothing left to buy. */
const INCLUDED = [
  {
    n: '01',
    t: 'The Self-Check',
    b: 'A 2-minute quiz that tells you whether insulin resistance is actually your problem — before you change a thing.',
  },
  {
    n: '02',
    t: 'The 3-Step Protocol',
    b: 'Three things, in a specific order, built into a day you are already living. No app, no math, nothing to buy.',
  },
  {
    n: '03',
    t: 'Why each step works',
    b: 'The reasoning in plain English, with the published research behind it, so you are not taking my word for any of it.',
  },
  {
    n: '04',
    t: 'The 14-day tracker',
    b: 'One page. Energy, cravings, sleep — the three things that move first, so you can see it working before the scale catches up.',
  },
]

function Inside() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(40px,5vw,68px)' }}>
      <Wrap>
        <h2 style={{ fontSize: 'clamp(24px,3.4vw,34px)', textAlign: 'center' }}>What is in it.</h2>
        <div style={{ marginTop: 26, display: 'grid', gap: 12 }}>
          {INCLUDED.map(d => (
            <div key={d.n} style={{ display: 'flex', gap: 16, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.vital, letterSpacing: '.1em', paddingTop: 4 }}>{d.n}</span>
              <div>
                <h3 style={{ fontSize: 18 }}>{d.t}</h3>
                <p style={{ marginTop: 7, fontSize: 15.5, lineHeight: 1.6, color: T.inkSoft }}>{d.b}</p>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── 5. Offer ──────────────────────────────────────────────────────
   No fake anchor price, no countdown. This buyer has seen that trick
   and it reads as a tell. */
function Offer() {
  return (
    <section style={{ paddingBlock: 'clamp(40px,5vw,68px)' }}>
      <Wrap style={{ maxWidth: 560 }}>
        <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 22, padding: 'clamp(28px,4vw,42px)', textAlign: 'center', boxShadow: T.shadowLg }}>
          <span className="eyebrow center">The Insulin Resistance Reset Kit</span>
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(54px,10vw,78px)', lineHeight: 1, marginTop: 14, color: T.forest }}>{PRICE}</div>
          <p style={{ marginTop: 10, fontSize: 16, color: T.inkSoft }}>One payment. Yours to keep.</p>
          <Buy style={{ marginTop: 26 }} note={false} />
          <p style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.lineSoft}`, fontSize: 14.5, color: T.inkSoft, lineHeight: 1.6 }}>
            <strong style={{ color: T.ink }}>{GUARANTEE}.</strong> Read it, run the self-check, try the steps. Not what you needed? Ask and you get all of it back.
          </p>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── 6. FAQ ────────────────────────────────────────────────────────
   Four. Only the objections that actually stop a $27 purchase, and
   none of the answers teach anything. */
const FAQS = [
  {
    q: 'My bloodwork came back normal. Is this still for me?',
    a: 'Almost certainly yes — that is the most common reason people buy it. Normal glucose and A1c mean you are not diabetic today. They do not mean nothing is happening. The kit explains exactly why those two tests miss this for years, and the self-check gives you a read your labs will not.',
  },
  {
    q: 'Do I have to cut carbs or count calories?',
    a: 'Neither. No food group is removed and there is no math anywhere in the kit. The tracker asks you to rate three things a day, and none of them is a number off a scale.',
  },
  {
    q: 'I am on metformin or a GLP-1. Can I still use it?',
    a: 'Yes, and plenty do. Nothing in the kit asks you to stop, reduce or change a prescription — that is between you and your doctor, full stop. It works alongside whatever you are on.',
  },
  {
    q: 'What if it is not for me?',
    a: `${GUARANTEE}. Email me and I refund you — no argument, no form. At $27 the risk is meant to be entirely mine.`,
  },
]

function FAQ() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(40px,5vw,68px)' }}>
      <Wrap>
        <h2 style={{ fontSize: 'clamp(24px,3.4vw,34px)', textAlign: 'center', marginBottom: 24 }}>Straight answers.</h2>
        {FAQS.map((f, i) => (
          <details key={i} className="faq" open={i === 0}>
            <summary>{f.q}<span className="ico" /></summary>
            <div className="ans">{f.a}</div>
          </details>
        ))}
      </Wrap>
    </section>
  )
}

/* ─── 7. Closer ─────────────────────────────────────────────────────
   Last CTA, then the one coaching line, then out. */
function Closer() {
  return (
    <section style={{ background: T.forest, color: '#fff', paddingBlock: 'clamp(44px,5.5vw,76px)' }}>
      <Wrap style={{ maxWidth: 560, textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 'clamp(25px,3.6vw,38px)' }}>
          This gets quietly worse while you wait for a test to catch it.
        </h2>
        <Buy style={{ marginTop: 26 }} note={false} />
        <p style={{ marginTop: 15, fontFamily: T.mono, fontSize: 12.5, color: 'rgba(255,255,255,.5)' }}>
          Instant download · {GUARANTEE}
        </p>
        <p style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.14)', fontSize: 14.5, color: 'rgba(255,255,255,.62)', lineHeight: 1.6 }}>
          Want the version Mike got, built around your labs and your schedule?{' '}
          <Link to={APPLY_URL} style={{ color: T.vital, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Apply for 1-on-1 coaching
          </Link>.
        </p>
      </Wrap>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: T.ink, color: '#fff', paddingBlock: 'clamp(28px,3.5vw,44px)' }}>
      <Wrap>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 12.5, lineHeight: 1.55 }}>
          Chainmover Coaching · Luke Strassner, Head Coach. Educational material, not medical advice. Nothing on this page or in the Insulin Resistance Reset Kit diagnoses, treats or replaces care from your physician, and no medical outcome is guaranteed. Never start, stop or change a medication based on anything you read here.
        </p>
      </Wrap>
    </footer>
  )
}

export default function KitPage() {
  useFonts()
  return (
    <div className="mroi-kit">
      <style>{CSS}</style>
      <Header />
      <main>
        <Symptoms />
        <Proof />
        <Inside />
        <Offer />
        <FAQ />
        <Closer />
      </main>
      <Footer />
    </div>
  )
}
