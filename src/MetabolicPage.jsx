import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import chainmoverLogo from './assets/ChainmoverLogo.png'
import coachTransformation from './assets/CoachLukeBeforeAfter.jpg'
import larryTransformation from './assets/LarryBeforeAfterJuly28.jpg'
import danielTransformation from './assets/DanielBeforeAfterJuly28.jpg'
import gabeTransformation from './assets/GabeBeforeAfterJuly28.jpg'
import mattTransformation from './assets/MattSBeforeAfterJuly28.jpg'
import ethanTransformation from './assets/EthanBeforeAfterJuly28.jpg'
import timTransformation from './assets/TimBeforeAfterJuly28.jpg'
import { QuoteGrid, FeaturedTransformation, TransformationPhoto } from './proofUtils'

/* ══════════════════════════════════════════════════════════════════════
   / — Chainmover Coaching home. Metabolic health / insulin resistance
   positioning, call-booking funnel: every CTA goes to /apply.

   Deliberately short. Six sections: say what this is, prove it heavily,
   answer the objections, ask for the call. The long-form teaching content
   (the insulin analogy, the four phases, the symptom list) lives in the
   VSL and on the call, not on this page.

   All styles scoped under `.mroi-met`.
   ══════════════════════════════════════════════════════════════════════ */

/* Every CTA lands here. The ?src= is read by ApplicationPage so leads
   from this page are attributable in the Apps Script sheet (quiz traffic
   carries a sessionStorage lead object, this traffic does not). */
const APPLY_URL = '/apply?src=metabolic'

/* Real capacity, not a countdown. If these numbers change, change them here. */
const CAPACITY_LINE = '45 clients at a time · typically 4 to 8 spots open each month'

/* Price floor. Honest against the async 12 month tier ($2,500 / 12 months
   = $48 a week). No ceiling is published: the tier conversation happens
   on the call. */
const PRICE_FLOOR = '$47 a week'

/* Main VSL, directly under the hero. Swap the ID here to change it. */
const VSL_LOOM_ID = '6833df367eae4444b6225ea68b8612ba'
const LOOM_PARAMS = 'hideEmbedTopBar=true&hide_owner=true&hide_title=true&hide_share=true'

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
  .mroi-met * { box-sizing: border-box; }
  .mroi-met { font-family: ${T.body}; color: ${T.ink}; background: ${T.paper}; font-size: 18px; line-height: 1.6; letter-spacing: -0.005em; }
  .mroi-met h1,.mroi-met h2,.mroi-met h3,.mroi-met h4 { font-family: ${T.display}; font-weight: 800; line-height: 1.08; letter-spacing: -0.025em; margin: 0; color: ${T.ink}; }
  .mroi-met p { margin: 0; }
  .mroi-met a { color: inherit; text-decoration: none; }
  .mroi-met img { max-width: 100%; display: block; }

  .mroi-met .eyebrow { font-family: ${T.mono}; font-size: 12.5px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: ${T.moss}; display: inline-flex; align-items: center; gap: 10px; }
  .mroi-met .eyebrow.center { justify-content: center; }
  .mroi-met .eyebrow.vital { color: ${T.vital}; }

  .mroi-met .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: ${T.body}; font-weight: 700; font-size: 16px; padding: 16px 30px; border-radius: 100px; border: none; cursor: pointer; transition: transform .18s ease, box-shadow .2s ease, background .2s; letter-spacing: -0.01em; }
  .mroi-met .btn:active { transform: translateY(1px); }
  .mroi-met .btn-vital { background: ${T.vital}; color: ${T.forest}; box-shadow: 0 8px 22px rgba(70,201,139,.32); }
  .mroi-met .btn-vital:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(70,201,139,.42); }
  .mroi-met .btn-lg { padding: 19px 40px; font-size: 18px; }

  .mroi-met .card { background: ${T.bone}; border: 1px solid ${T.line}; border-radius: 16px; padding: 24px 24px 26px; }

  .mroi-met .faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 20px 0; font-family: ${T.display}; font-weight: 700; font-size: 17px; color: ${T.ink}; border-top: 1px solid ${T.line}; user-select: none; }
  .mroi-met .faq summary::-webkit-details-marker { display: none; }
  .mroi-met .faq summary .ico::after { content: "+"; font-size: 22px; font-weight: 400; color: ${T.moss}; transition: transform .25s; display: inline-block; }
  .mroi-met .faq[open] summary .ico::after { transform: rotate(45deg); }
  .mroi-met .faq .ans { padding: 0 0 20px; font-size: 15.5px; color: ${T.inkSoft}; line-height: 1.65; }

  @media (max-width: 900px) {
    .mroi-met .proof-grid { grid-template-columns: 1fr 1fr !important; }
    .mroi-met .ba-grid { grid-template-columns: 1fr !important; }
    .mroi-met .does-grid { grid-template-columns: 1fr !important; }
    .mroi-met .transform-photo img { height: auto !important; min-height: 0 !important; aspect-ratio: 3 / 2; }
  }
  @media (max-width: 620px) {
    .mroi-met .proof-grid { grid-template-columns: 1fr !important; }
    .mroi-met .wall-grid { grid-template-columns: 1fr 1fr !important; }
  }
`

function Wrap({ children, style }) {
  return <div style={{ maxWidth: 860, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', ...style }}>{children}</div>
}

/* One CTA, rendered at every decision point. Same label, same destination. */
const APPLY = (extra, label = 'Apply to work with Luke') => (
  <Link to={APPLY_URL} className="btn btn-vital btn-lg" style={extra}>{label}</Link>
)

/* ─── 1. Header + hero ─────────────────────────────────────────────── */
function Header() {
  return (
    <>
      {/* Fully opaque — no blur/translucency, content must not show through. */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.paper, borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ background: T.forest, color: '#fff', textAlign: 'center', padding: '9px 16px', fontFamily: T.mono, fontSize: 12.5, letterSpacing: '.02em' }}>
          {CAPACITY_LINE}
        </div>
        <Wrap>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, gap: 16 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={chainmoverLogo} alt="" style={{ height: 34, width: 'auto', objectFit: 'contain', display: 'block' }} />
              <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: T.ink, whiteSpace: 'nowrap' }}>Chainmover Coaching</span>
            </Link>
            <Link to={APPLY_URL} className="btn btn-vital" style={{ padding: '12px 24px', fontSize: 15 }}>Apply now</Link>
          </div>
        </Wrap>
      </header>

      <section style={{ background: `radial-gradient(120% 120% at 50% -10%,${T.mist} 0%,rgba(232,241,234,0) 55%),${T.paper}`, paddingTop: 'clamp(44px,6vw,80px)', paddingBottom: 'clamp(44px,6vw,72px)' }}>
        <Wrap style={{ textAlign: 'center' }}>
          <span className="eyebrow center" style={{ marginBottom: 18 }}>Metabolic health · Insulin resistance · Fat loss</span>
          {/* Short outcome headline carries no mechanism on purpose — the
              subhead below does that work, including the "eat more" claim. */}
          <h1 style={{ fontSize: 'clamp(40px,6.4vw,68px)' }}>Lose it once. Keep it for good.</h1>
          <p style={{ marginTop: 18, fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(18px,2.2vw,25px)', color: T.forest, lineHeight: 1.3, letterSpacing: '-0.01em', maxWidth: 660, marginInline: 'auto' }}>
            Improve your labs, reduce your insulin resistance, and lose fat for the long term.
          </p>

          {/* VSL does the job the sales call used to do, so it sits above
              the first CTA rather than further down the page. */}
          <div style={{ marginTop: 34, position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 18, overflow: 'hidden', boxShadow: T.shadowLg, border: `1px solid ${T.line}`, background: '#000' }}>
            <iframe
              src={`https://www.loom.com/embed/${VSL_LOOM_ID}?${LOOM_PARAMS}`}
              title="Chainmover Coaching — how the MROI Method works"
              frameBorder="0"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          </div>
          <p style={{ marginTop: 14, fontFamily: T.mono, fontSize: 12.5, color: T.inkFaint }}>
            Watch this first, then apply
          </p>

          <div style={{ marginTop: 26 }}>{APPLY()}</div>
          {/* <p style={{ marginTop: 16, fontFamily: T.mono, fontSize: 13, color: T.inkFaint }}>
            Plans start as low as {PRICE_FLOOR}
          </p> */}
        </Wrap>
      </section>
    </>
  )
}

/* ─── 2. What this actually is ──────────────────────────────────────
   Three lines. Anything longer belongs in the VSL or on the call.     */
const DOES = [
  {
    n: '01',
    t: 'Insulin sensitivity comes first',
    b: 'Most programs push fat loss before the underlying metabolic picture supports it. We start by improving how you handle carbohydrates, which is why energy tends to improve before the scale does.',
  },
  {
    n: '02',
    t: 'A protocol built around your life',
    b: 'Nutrition, training, sleep and daily movement, built for your schedule, your joints and your starting point. Reviewed and adjusted every week against your own data.',
  },
  {
    n: '03',
    t: 'You work directly with Luke',
    b: 'Every check in and every adjustment comes from Luke, never a sub coach. Capacity is capped at 45 clients so it stays that way.',
  },
]

function WhatWeDo() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(52px,7vw,96px)' }}>
      <Wrap>
        <div style={{ textAlign: 'center', maxWidth: 620, marginInline: 'auto', marginBottom: 36 }}>
          <span className="eyebrow center">What this is</span>
          <h2 style={{ fontSize: 'clamp(27px,3.8vw,42px)', marginTop: 16 }}>1-on-1 coaching that prioritizes your metabolic health markers. </h2>
          <p style={{ marginTop: 16, fontSize: 17, color: T.inkSoft, lineHeight: 1.6 }}>
            Built on established metabolic science, the same markers your physician tracks, and adjusted with your own weekly data rather than a template. The weight comes off as a byproduct.
          </p>
        </div>

        <div className="does-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {DOES.map(d => (
            <div key={d.n} className="card" style={{ background: T.paper }}>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.vital, letterSpacing: '.12em' }}>{d.n}</span>
              <h3 style={{ fontSize: 19, marginTop: 10 }}>{d.t}</h3>
              <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6, color: T.inkSoft }}>{d.b}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── 3. Results ────────────────────────────────────────────────────
   The bulk of the page. Numbers, faces, words, in that order.        */
const FEATURED = [
  { name: 'Larry', stat: 'Down 45 lbs in 5 months', quote: "Other coaches felt like I got handed off to a stranger. With Luke I actually get Luke. If I don't have enough communication it doesn't work for me, and this works.", photo: larryTransformation },
  { name: 'Daniel', stat: 'Down 85 lbs', quote: "Two months in, people are noticing. I get compliments from family, coworkers, friends. I can't recall the last time I felt this confident.", photo: danielTransformation },
  { name: 'Gabe', stat: 'Down 25 lbs in 3 months', quote: "My clothes fit better and my energy is back. I finally feel like I can do this. It's not just a pipe dream anymore.", photo: gabeTransformation },
]

/* Photo wall. These four have real numbers but no written quote yet — once
   one exists, move them up to FEATURED for a full card. */
const WALL = [
  { name: 'Luke', photo: coachTransformation, note: 'Coach · started at 300 lbs, pre-diabetic' },
  { name: 'Ethan', photo: ethanTransformation, note: 'Truck driver · down 80 lbs' },
  { name: 'Tim', photo: timTransformation, note: 'Engineer · down 30 lbs' },
  { name: 'Matt', photo: mattTransformation, note: '53 · sales exec' },
]

const QUOTES = [
  { name: 'Mike', stat: 'Retired, 55 · A1c 7.0 to 6.3', quote: "I'd been through three different doctors and two medications and nobody could tell me why the weight wouldn't move or help me. I used to be 350. After hiring Luke, I broke 300 for the first time without a drug doing it for me." },
  { name: 'JD', stat: 'Father of two, 47', quote: "I was 280 when I got married in 2005. In 2025 I was 380. Now I'm very close to leaving the 300 lbs club and coming into the 200 club." },
  { name: 'Sascha', stat: 'Father, entrepreneur', quote: "First time in years the scale is going the right way. I broke 230 in the first couple of weeks. Can't tell you the last time I've been this low. My nutrition is dialed in and the weight is moving." },
  { name: 'Wyatt', stat: 'Doctor of Chiropractic Medicine, down 14 lbs in 7 weeks', quote: "You're not just doing a little bit of exercise and a little bit of nutrition. You get down to the details. That's what makes me think you know what you're doing." },
]

/* The marker the whole offer is about, moving on a real client. Framed as
   what happened to Mike, not as a promise: 6.3 is out of the type 2 range
   but still above the 5.7 pre-diabetes line, and saying so is both
   accurate and more believable than rounding it up to a win. */
function MarkerMove() {
  return (
    <div style={{ background: T.forest, color: '#fff', borderRadius: 20, padding: 'clamp(28px,3.5vw,40px)', marginBottom: 24, boxShadow: T.shadowLg }}>
      <span className="eyebrow vital">The marker that matters</span>
      <h3 style={{ color: '#fff', fontSize: 'clamp(22px,2.8vw,30px)', marginTop: 12 }}>
        Mike reversed his Type 2 Diabetes.
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px,3vw,28px)', marginTop: 26, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>Before</div>
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(38px,6vw,54px)', lineHeight: 1, color: 'rgba(255,255,255,.6)' }}>7.0</div>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke={T.vital} strokeWidth="2.5" style={{ width: 30, height: 30, flexShrink: 0 }}>
          <line x1="4" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" />
        </svg>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: T.vital }}>One month later</div>
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(38px,6vw,54px)', lineHeight: 1, color: T.vital }}>6.3</div>
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 15.5, color: 'rgba(255,255,255,.8)', lineHeight: 1.65, maxWidth: 560 }}>
A1c at or above 6.5 is the type 2 range. 5.7 and above is pre-diabetic. Mike started at 350 pounds on two medications, and after one month of work focused on insulin sensitivity his A1c sat below the type 2 threshold. 
 <br /><em>This is not medical advice, please consult your doctor. I cannot guarantee any medical outcomes.</em>
      
      </p>
    </div>
  )
}

function Results() {
  return (
    <section style={{ paddingBlock: 'clamp(52px,7vw,96px)' }}>
      <Wrap>
        <div style={{ textAlign: 'center', maxWidth: 620, marginInline: 'auto', marginBottom: 40 }}>
          <span className="eyebrow center">Results</span>
          <h2 style={{ fontSize: 'clamp(27px,3.8vw,44px)', marginTop: 16 }}>Real clients. Real numbers.</h2>
        </div>

        <MarkerMove />

        {FEATURED.map(f => (
          <FeaturedTransformation
            key={f.name}
            T={T}
            photoSrc={f.photo}
            name={f.name}
            stat={f.stat}
            quote={f.quote}
            className="ba-grid transform-photo"
          />
        ))}

        {/* Photo wall — density without more copy. */}
        <div className="wall-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
          {WALL.map(w => (
            <div key={w.name} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 14, overflow: 'hidden', boxShadow: T.shadow }}>
              <TransformationPhoto T={T} src={w.photo} alt={`${w.name} before and after`} minHeight={150} badgeOffset={8} />
              <div style={{ padding: '11px 13px 13px' }}>
                <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 15, color: T.forest }}>{w.name}</div>
                {w.note ? <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.moss, marginTop: 3, lineHeight: 1.4 }}>{w.note}</div> : null}
              </div>
            </div>
          ))}
        </div>

        <QuoteGrid
          quotes={QUOTES}
          className="proof-grid"
          gridStyle={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}
          cardClassName="card"
          cardStyle={{ margin: 0, background: T.paper, display: 'flex', flexDirection: 'column' }}
          quoteStyle={{ fontSize: 15.5, lineHeight: 1.6, color: T.ink }}
          footerStyle={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}
          nameStyle={{ fontFamily: T.display, fontSize: 16, color: T.ink }}
          statStyle={{ fontFamily: T.mono, fontSize: 12, color: T.moss }}
        />

        {/* Typical-results disclosure. Required alongside standout
            testimonials — the "results not typical" safe harbor no longer
            exists under the FTC endorsement guides. */}
        <p style={{ marginTop: 24, fontSize: 13.5, color: T.inkFaint, lineHeight: 1.6, textAlign: 'center', maxWidth: 640, marginInline: 'auto' }}>
          These are individual results and are not what everyone should expect. A typical client loses 1 to 2 pounds a week, and 15 to 40 pounds across the first two phases. Your own results depend on your starting point, your health history and how consistently you follow the plan.
        </p>

        <div style={{ marginTop: 36, textAlign: 'center' }}>{APPLY()}</div>
      </Wrap>
    </section>
  )
}

/* ─── 4. FAQ ────────────────────────────────────────────────────────
   Absorbs what used to be standalone sections: pricing, the guarantee
   and its conditions, and the scope-of-practice answer.               */
const FAQS = [
  { q: 'How much does it cost?', a: 'Plans start as low as $47 a week. I run several programs and the right one depends on how much support you need, so we settle that together once you are accepted, rather than putting you into a tier you did not pick. I would never want money to be the reason I could not help someone.' },
  { q: 'What if it is not right for me?', a: 'Two things. Your first week is on me: get accepted today and your program clock starts the following Monday, so you get the app, your intake and your first week before you are paying for any of it. And you have seven days from your start date to change your mind, message me directly and I refund you in full, processed within 5 business days. After day seven, refunds are at my discretion.' },
  { q: 'Do I have to cut carbs?', a: 'No, and that is the point. The goal is to have you eating more carbs than you are eating right now and still losing weight. Being afraid of rice or bread for the rest of your life is not a plan.' },
  { q: 'Do I have to count calories forever?', a: 'No. You will track for the first month or two, because that is the fastest way to understand what is actually in your food. After that we move you to eating intuitively.' },
  { q: 'What if my bloodwork came back normal?', a: 'That is common, and it is exactly why this gets missed. Fasting glucose and A1c are lagging indicators, so they only move once insulin can no longer compensate. Reduced energy, afternoon crashes and easier fat gain can all appear years before a lab value shifts.' },
  { q: 'Can you reverse my insulin resistance or pre-diabetes?', a: 'I am a coach, not a doctor, so I will not promise that and you should be careful with anyone who does. What I do is coach the daily behaviors, food, training, sleep, stress and steps, that support better metabolic health. Clients have seen real changes in their markers. You keep your physician in the loop the whole way.' },
  { q: 'What if I am on medication, or on a GLP-1?', a: 'Plenty of clients start on blood pressure medication, metformin or a GLP-1. Nothing here asks you to stop or change a prescription, that is between you and your doctor. Tell me on your application what you are taking and I will build around it.' },
  { q: 'I am too busy for this.', a: 'If a plan only works during the calm weeks of your life, it does not work. Your plan gets built for your worst week, not your best one, because those are the weeks that decide whether this holds.' },
  { q: 'Do I need a gym?', a: 'No. Home setup, full gym or nothing at all, the training gets built around the equipment you actually have.' },
  { q: 'Do I work with you, or a sub coach?', a: 'Me. Capacity stays at 45 clients on purpose so every check in and every adjustment comes from me directly.' },
  { q: 'What happens after I apply?', a: 'I read every application myself. If it looks like a fit, you hear back and we take it from there. Capacity is capped at 45 clients, so not every application gets accepted, and I would rather tell you that up front than waste your time.' },
]

function FAQ() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(52px,7vw,96px)' }}>
      <Wrap style={{ maxWidth: 720 }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <span className="eyebrow center">Questions</span>
          <h2 style={{ fontSize: 'clamp(27px,3.8vw,42px)', marginTop: 16 }}>Straight answers.</h2>
        </div>
        <div>
          {FAQS.map((f, i) => (
            <details key={i} className="faq" open={i === 0}>
              <summary>{f.q}<span className="ico" /></summary>
              <div className="ans">{f.a}</div>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── 5. Closer ────────────────────────────────────────────────────── */
function Closer() {
  return (
    <section style={{ background: T.forest, color: '#fff', paddingBlock: 'clamp(52px,7vw,96px)' }}>
      <Wrap style={{ maxWidth: 620, textAlign: 'center' }}>
        <span className="eyebrow center vital">Your move</span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(27px,3.8vw,42px)', marginTop: 16 }}>This only gets harder the longer you wait. Start today.</h2>
        <div style={{ marginTop: 30 }}>{APPLY()}</div>
        <p style={{ marginTop: 18, fontFamily: T.mono, fontSize: 12.5, color: 'rgba(255,255,255,.5)' }}>
          Takes 30 seconds · {CAPACITY_LINE}
        </p>
      </Wrap>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: T.ink, color: '#fff', paddingBlock: 'clamp(40px,5vw,64px)' }}>
      <Wrap>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 17 }}>Chainmover Coaching</span>
          </div>
          <Link to={APPLY_URL} className="btn btn-vital">Apply now</Link>
        </div>
        <p style={{ marginTop: 20, color: 'rgba(255,255,255,.4)', fontSize: 12.5, lineHeight: 1.55 }}>
          Luke Strassner, Head Coach. Coaching, not medical advice. Nothing here diagnoses, treats or replaces care from your physician. Always work with your doctor on your own situation, and never start, stop or change a medication based on anything on this page.
        </p>
      </Wrap>
    </footer>
  )
}

export default function MetabolicPage() {
  useFonts()
  return (
    <div className="mroi-met">
      <style>{CSS}</style>
      <Header />
      <main>
        <WhatWeDo />
        <Results />
        <FAQ />
        <Closer />
      </main>
      <Footer />
    </div>
  )
}
