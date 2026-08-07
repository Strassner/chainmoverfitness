import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import metashiftLogo from './assets/MetaShiftLogoTrimmed.png'
import coachPhoto from './assets/coachesphoto.png'
import larryTransformation from './assets/LarryBeforeAfterJuly28.jpg'
import danielTransformation from './assets/DanielBeforeAfterJuly28.jpg'
import gabeTransformation from './assets/GabeBeforeAfterJuly28.jpg'
import { QuoteGrid, FeaturedTransformation, PersonStoryFeature } from './proofUtils'

/* ══════════════════════════════════════════════════════════════════════
   ISOLATED TEST ROUTE — /landing  (warm-traffic sales page, VSL led)
   Fully self-contained. All styles scoped under `.mroi-lp`.
   ══════════════════════════════════════════════════════════════════════ */

/* VSL — paste the short 8 to 12 minute cut's Loom share ID here. */
const VSL_LOOM_ID = 'PASTE_VSL_LOOM_ID_HERE'
const LOOM_PARAMS = 'hideEmbedTopBar=true&hide_owner=true&hide_title=true&hide_share=true'

/* Product name — must match PRODUCT_NAME in BuyPage.jsx so the name doesn't
   change between this funnel and checkout. */
const PRODUCT_NAME = 'The 300lb to Lean Blueprint'

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
  .mroi-lp * { box-sizing: border-box; }
  .mroi-lp { font-family: ${T.body}; color: ${T.ink}; background: ${T.paper}; font-size: 18px; line-height: 1.6; letter-spacing: -0.005em; }
  .mroi-lp h1,.mroi-lp h2,.mroi-lp h3,.mroi-lp h4 { font-family: ${T.display}; font-weight: 800; line-height: 1.08; letter-spacing: -0.025em; margin: 0; color: ${T.ink}; }
  .mroi-lp p { margin: 0; }
  .mroi-lp a { color: inherit; text-decoration: none; }
  .mroi-lp img { max-width: 100%; display: block; }

  .mroi-lp .eyebrow { font-family: ${T.mono}; font-size: 12.5px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: ${T.moss}; display: inline-flex; align-items: center; gap: 10px; }
  .mroi-lp .eyebrow.center { justify-content: center; }
  .mroi-lp .eyebrow.vital { color: ${T.vital}; }

  .mroi-lp .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: ${T.body}; font-weight: 700; font-size: 16px; padding: 16px 30px; border-radius: 100px; border: none; cursor: pointer; transition: transform .18s ease, box-shadow .2s ease, background .2s; letter-spacing: -0.01em; }
  .mroi-lp .btn:active { transform: translateY(1px); }
  .mroi-lp .btn-vital { background: ${T.vital}; color: ${T.forest}; box-shadow: 0 8px 22px rgba(70,201,139,.32); }
  .mroi-lp .btn-vital:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(70,201,139,.42); }
  .mroi-lp .btn-lg { padding: 19px 40px; font-size: 18px; }

  .mroi-lp .card { background: ${T.bone}; border: 1px solid ${T.line}; border-radius: 16px; padding: 24px 24px 26px; }

  .mroi-lp .faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 20px 0; font-family: ${T.display}; font-weight: 700; font-size: 17px; color: ${T.ink}; border-top: 1px solid ${T.line}; user-select: none; }
  .mroi-lp .faq summary::-webkit-details-marker { display: none; }
  .mroi-lp .faq summary .ico::after { content: "+"; font-size: 22px; font-weight: 400; color: ${T.moss}; transition: transform .25s; display: inline-block; }
  .mroi-lp .faq[open] summary .ico::after { transform: rotate(45deg); }
  .mroi-lp .faq .ans { padding: 0 0 20px; font-size: 15.5px; color: ${T.inkSoft}; line-height: 1.65; }

  @media (max-width: 900px) { .mroi-lp .proof-grid { grid-template-columns: 1fr 1fr !important; } .mroi-lp .get-grid { grid-template-columns: 1fr !important; } .mroi-lp .ba-grid { grid-template-columns: 1fr !important; } .mroi-lp .lab-grid { grid-template-columns: 1fr !important; } .mroi-lp .transform-photo img { height: auto !important; min-height: 0 !important; aspect-ratio: 3 / 2; } }
  @media (max-width: 620px) { .mroi-lp .proof-grid { grid-template-columns: 1fr !important; } .mroi-lp .nav-links { display: none !important; } }
`

function Wrap({ children, style }) {
  return <div style={{ maxWidth: 860, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', ...style }}>{children}</div>
}

const START = (extra) => (
  <Link to="/buy" className="btn btn-vital btn-lg" style={extra}>Start Now</Link>
)

/* Block 1 — sticky nav + positioning header */
function Header() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ background: T.forest, color: '#fff', textAlign: 'center', padding: '9px 16px', fontFamily: T.mono, fontSize: 13, letterSpacing: '.02em' }}>
          Only <span style={{ textDecoration: 'line-through', opacity: .6 }}>15</span> <b style={{ color: T.vital, fontSize: 14 }}>11 slots</b> open for August
        </div>
        <Wrap>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, gap: 16 }}>
            <Link to="/landing" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={metashiftLogo} alt="MetaShift Health" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
            </Link>
            <Link to="/buy" className="btn btn-vital" style={{ padding: '12px 24px', fontSize: 15 }}>Start Now</Link>
          </div>
        </Wrap>
      </header>

      <section style={{ background: `radial-gradient(120% 120% at 50% -10%,${T.mist} 0%,rgba(232,241,234,0) 55%),${T.paper}`, paddingTop: 'clamp(40px,6vw,72px)', paddingBottom: 'clamp(24px,3vw,32px)' }}>
        <Wrap style={{ textAlign: 'center' }}>
          <span className="eyebrow center" style={{ marginBottom: 18 }}>MetaShift Health · Coach Luke Strassner</span>
          <h1 style={{ fontSize: 'clamp(38px,6vw,62px)' }}>Redefine your health.</h1>
          <p style={{ marginTop: 16, fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(18px,2.2vw,25px)', color: T.forest, lineHeight: 1.25, letterSpacing: '-0.01em', maxWidth: 640, marginInline: 'auto' }}>
            Get the weight off and your energy back in 6 months, without starving, cutting carbs, or living in the gym.
          </p>
          
        </Wrap>
      </section>
    </>
  )
}

/* Block 2 — VSL */
function VSL() {
  return (
    <section style={{ background: T.paper, paddingBottom: 'clamp(8px,2vw,16px)' }}>
      <Wrap>
        <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', aspectRatio: '16 / 9', background: '#000', boxShadow: T.shadowLg, border: `1px solid ${T.line}` }}>
          {VSL_LOOM_ID === 'PASTE_VSL_LOOM_ID_HERE' ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: T.inkFaint, fontFamily: T.mono, fontSize: 13, textAlign: 'center', padding: 24, background: T.mist }}>
              <div style={{ width: 62, height: 62, borderRadius: '50%', background: T.forest, display: 'grid', placeItems: 'center' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <span style={{ fontSize: 15, color: T.inkSoft, fontWeight: 600 }}>Short VSL goes here</span>
              <span>Paste your Loom ID into VSL_LOOM_ID at the top of LandingSalesPage.jsx</span>
            </div>
          ) : (
            <iframe
              src={`https://www.loom.com/embed/${VSL_LOOM_ID}?${LOOM_PARAMS}`}
              title={PRODUCT_NAME}
              frameBorder="0"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          )}
        </div>
      </Wrap>
    </section>
  )
}

/* Block 3 — belief line + folded symptom line */
function Belief() {
  return (
    <section style={{ paddingBlock: 'clamp(40px,6vw,72px)' }}>
      <Wrap style={{ textAlign: 'center', maxWidth: 720 }}>
        <p style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(24px,3.4vw,36px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: T.ink }}>
          You have been told to just be more consistent. Consistency is not something you force. It comes from structure, and from fixing the low energy that is dragging you down.
        </p>
        <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.6vw,19px)', color: T.inkSoft, lineHeight: 1.6 }}>
          When you are foggy and crashing every afternoon, staying on track feels impossible. We build the structure and fix the energy. Then it gets easy.
        </p>
        <p style={{ marginTop: 20, fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(18px,2vw,22px)', color: T.forest, lineHeight: 1.4 }}>
          That was never a discipline problem. That was a system that was never built for your actual life.
        </p>
        <p style={{ marginTop: 16, fontSize: 15.5, color: T.inkFaint, fontStyle: 'italic', lineHeight: 1.6 }}>
          "It's not for a lack of trying. I already know what to do. That is the problem."
        </p>
      </Wrap>
    </section>
  )
}

/* Block 4 — proof, stacked
   Order: 3 featured photo transformations, then the written testimonials.
   Lab report cards are commented out below until real screenshots are
   ready — see the bottom of this block.                                */

/* The 3 featured transformations up top. */
const FEATURED_TRANSFORMATIONS = [
  { name: 'Larry', stat: 'Down 45 lbs in 5 months', quote: "Other coaches felt like I got handed off to a stranger. With Luke I actually get Luke. If I don't have enough communication it doesn't work for me, and this works.", photo: larryTransformation },
  { name: 'Daniel', stat: 'Down 85 lbs', quote: "Two months in, people are noticing. I get compliments from family, coworkers, friends. I can't recall the last time I felt this confident.", photo: danielTransformation },
  { name: 'Gabe', stat: 'Down 25 lbs in 3 months, engineer', quote: "My clothes fit better and my energy is back. I finally feel like I can do this. It's not just a pipe dream anymore.", photo: gabeTransformation },
]

/* Full written-testimonial bank. Everyone in here renders in the
   "In their words" tier below, stack as much proof as possible.       */
const QUOTES = [
  { name: 'Sascha', stat: 'Father, entrepreneur', quote: "First time in years the scale is going the right way. I broke 230 in the first couple of weeks. Can't tell you the last time I've been this low. My nutrition is dialed in and the weight is moving." },
  { name: 'Wyatt', stat: 'Doctor of Chiropractic Medicine, down 14 Lbs in 7 weeks', quote: "You're not just doing a little bit of exercise and a little bit of nutrition. You get down to the details. That's what makes me think you know what you're doing." },
  { name: 'JD', stat: 'Father of two, 47 years old', quote: "I was 280 when I got married in 2005. In 2025 I was 380. Now I'm very close to leaving the 300 lbs club and coming into the 200 club." },
  { name: 'Mike', stat: 'Retired, father, 55 years old', quote: "I'd been through three different doctors and two medications and nobody could tell me why the weight wouldn't move or help me. I used to be 350. After hiring Luke, I broke 300 for the first time without a drug doing it for me." },
]

/* Lab report cards — commented out for now, bring back when real lab
   screenshots + numbers are ready. See proofUtils.jsx (LabProofGrid).
const LAB_PROOFS = [
  { name: 'Mike', stat: 'Fasting glucose 186 to 127 in 4 weeks (Metabolic phase)' },
  { name: 'Client B', stat: 'TODO — add stat' },
  { name: 'Client C', stat: 'TODO — add stat' },
]
*/

function Proof() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap>
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 44 }}>
          <span className="eyebrow center">Real clients. Real results.</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', marginTop: 16 }}>I was you. I found the way out.</h2>
        </div>

        {/* Luke's story */}
        <PersonStoryFeature
          T={T}
          photoSrc={coachPhoto}
          photoAlt="Coach Luke"
          headline="I was 300 pounds."
          paragraphs={[
            "I was obese my whole life. I played offensive line, so being big had a place. Then I stopped playing, and it hit me. If I did not take care of my health now, it would only get harder. Less energy every year. Feeling worse every year.",
            "What scared me was not being 300 pounds. It was the thought of living the rest of my life like that. I worked hard everywhere else and reached for my potential. But when I looked at my health, I was behind everyone. So I fixed it. That is what I run you through now.",
          ]}
        />

        {/* Featured transformations — Larry, Daniel, Gabe */}
        {FEATURED_TRANSFORMATIONS.map(f => (
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

        {/* Written testimonials — best 3 */}
        <span className="eyebrow center" style={{ display: 'block', textAlign: 'center', marginBottom: 18 }}>In their words</span>
        <QuoteGrid
          quotes={QUOTES}
          className="proof-grid"
          gridStyle={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 44 }}
          cardClassName="card"
          cardStyle={{ margin: 0, background: T.paper, display: 'flex', flexDirection: 'column' }}
          quoteStyle={{ fontSize: 15.5, lineHeight: 1.6, color: T.ink }}
          footerStyle={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}
          nameStyle={{ fontFamily: T.display, fontSize: 16, color: T.ink }}
          statStyle={{ fontFamily: T.mono, fontSize: 12, color: T.moss }}
        />

        {/* Lab report cards — commented out for now
        <span className="eyebrow center" style={{ display: 'block', textAlign: 'center' }}>The labs don't lie</span>
        <LabProofGrid proofs={LAB_PROOFS} T={T} columns={3} className="lab-grid" style={{ marginTop: 18 }} />
        */}
      </Wrap>
    </section>
  )
}

/* The four phases (how it works, feel-led) */
const PHASES = [
  { letter: 'M', title: 'Metabolic', body: "Energy usually improves first, and the scale follows. You eat more carbohydrates here, not fewer. The focus is improving how you handle them, so food gets used for energy rather than leaving you foggy and crashing at 3pm." },
  { letter: 'R', title: 'Recovery', body: "Next we work on sleep quality, stress load and joints. The bad back or the bad knees, we train around them and on them. Sleep is treated as a lever rather than an afterthought, because it moves insulin sensitivity directly." },
  { letter: 'O', title: 'Optimize', body: "Cardio enters here for the first time, for cardiovascular health and for faster fat loss. The foundation is set and you already feel better, so this is where we push. Most clients are down 15 to 30 pounds across the first two phases. We add muscle here too, because there is finally the energy for it." },
  { letter: 'I', title: 'Identity', body: "This is where it becomes permanent. We work on this the whole way through, so by the end it is not a program you follow. It is just how you live." },
]

function Phases() {
  return (
    <section style={{ paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap>
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 44 }}>
          <span className="eyebrow center">How it works</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', marginTop: 16 }}>The four phases</h2>
          <p style={{ marginTop: 16, fontSize: 'clamp(16px,1.5vw,18px)', color: T.inkSoft, lineHeight: 1.6 }}>
            You do not do this all at once. We go in order, one phase at a time, so it holds.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760, marginInline: 'auto' }}>
          {PHASES.map(p => (
            <div key={p.letter} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: T.bone, border: `1px solid ${T.line}`, borderRadius: 16, padding: 'clamp(22px,3vw,30px)' }}>
              <span style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 14, background: T.forest, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 24 }}>{p.letter}</span>
              <div>
                <h3 style={{ fontSize: 21 }}>{p.title}</h3>
                <p style={{ marginTop: 10, fontSize: 15.5, color: T.inkSoft, lineHeight: 1.6 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* Block 5 — what you get */
const DELIVERABLES = [
  {
    name: 'Personalized Onboarding',
    body: 'Before you start, we find exactly what has been holding you back.',
    points: [
      'A 15 minute onboarding call',
      'A Metabolic Risk Assessment to find your primary blocker, nutrition, stress, sleep, or tracking accuracy',
      'Your starting protocol, built around your specific results, not a generic template',
    ],
  },
  {
    name: 'Your Core Protocol',
    body: 'The metabolic health first system that runs the whole time you are with me.',
    points: [
      'A nutrition framework built on the M.R.O.I. method',
      'A stress and sleep protocol targeting the biggest non food driver of insulin resistance',
      'A movement protocol, the minimum effective dose, not a gym program you will not stick to',
    ],
  },
  {
    name: 'Weekly Adjustments',
    body: 'A weekly check in, and your protocol reviewed and adjusted every week based on how your body is actually responding. Not a static plan you are left to figure out alone.',
  },
  {
    name: 'Ongoing Support',
    body: 'Message access for questions between check ins, with a response within 48 hours. Plus access to the private client community.',
  },
  {
    name: 'The Safety Net',
    body: 'Your 14 day money back guarantee.',
  },
]

function WhatYouGet() {
  return (
    <section style={{ paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap>
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 44 }}>
          <span className="eyebrow center">What you get</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', marginTop: 16 }}>{PRODUCT_NAME}</h2>
          <p style={{ marginTop: 16, fontSize: 'clamp(16px,1.5vw,18px)', color: T.inkSoft, lineHeight: 1.6 }}>
            All built for a busy life. Let me do the thinking and the planning. You just show up, and look back in a few months as a different man.
          </p>
        </div>
        <div className="get-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18, maxWidth: 720, marginInline: 'auto' }}>
          {DELIVERABLES.map((d, i) => (
            <div key={d.name} className="card">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: T.mono, fontSize: 13, color: T.moss }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 style={{ fontSize: 19 }}>{d.name}</h3>
              </div>
              <p style={{ marginTop: 12, fontSize: 15, color: T.inkSoft, lineHeight: 1.6 }}>{d.body}</p>
              {d.points && (
                <ul style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {d.points.map((pt, j) => (
                    <li key={j} style={{ fontSize: 14.5, color: T.inkSoft, lineHeight: 1.55 }}>{pt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* Block 6 — course correction (sell the relationship) */
function CourseCorrection() {
  return (
    <section style={{ background: T.forest, color: '#fff', paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ textAlign: 'center', maxWidth: 720 }}>
        <span className="eyebrow center vital">The coaching</span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(28px,4vw,46px)', marginTop: 16 }}>The day you start to drift, I pull you back.</h2>
        <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.6vw,20px)', color: 'rgba(255,255,255,.86)', lineHeight: 1.65 }}>
          That is my job. Not to hand you a plan and disappear. When your week falls apart, I am the one who gets you back on track.
        </p>
        <p style={{ marginTop: 18, fontSize: 'clamp(17px,1.6vw,20px)', color: '#fff', fontWeight: 600, lineHeight: 1.6 }}>
          If you want a friend, this is not for you. If you want a coach who cares and is not afraid to call out your BS, you are in the right place.
        </p>
      </Wrap>
    </section>
  )
}

/* Block 7 — the bad week */
function BadWeek() {
  return (
    <section style={{ paddingBlock: 'clamp(48px,6vw,80px)' }}>
      <Wrap style={{ maxWidth: 720 }}>
        <div style={{ background: T.mist, border: `1px solid ${T.line}`, borderRadius: 18, padding: 'clamp(28px,4vw,40px)', textAlign: 'center' }}>
          <p style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(22px,3vw,30px)', lineHeight: 1.25, color: T.ink }}>
            You will have a bad week.
          </p>
          <p style={{ marginTop: 14, fontSize: 'clamp(16px,1.5vw,18px)', color: T.inkSoft, lineHeight: 1.6 }}>
            That is week 4, not failure. Every man hits it. The difference is you will not be doing it by yourself. That is exactly when I step in.
          </p>
        </div>
      </Wrap>
    </section>
  )
}

/* Block 8 — the 14 days, extremely clear */
function Fourteen() {
  const steps = [
    'You get your plan and start week 1.',
    "You do the check ins. I review your week and make your first adjustments.",
    'If it is not for you by day 14, you message me and get every dollar back.',
  ]
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 720 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="eyebrow center">Your first 14 days</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>Try it for 14 days. Your money is safe the whole time.</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: T.paper, border: `1px solid ${T.line}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, background: T.forest, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 16 }}>{i + 1}</span>
              <p style={{ fontSize: 16.5, color: T.ink, lineHeight: 1.55 }}>{s}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 22, textAlign: 'center', fontSize: 16, color: T.inkSoft, lineHeight: 1.6 }}>
          Do the check ins, follow the week 1 plan, and if it is not for you, get a full refund. 
        </p>
      </Wrap>
    </section>
  )
}

/* Block 9 — offer, price, urgency, CTA */
function Offer() {
  return (
    <section style={{ paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 640, textAlign: 'center' }}>
        <span className="eyebrow center">Start now</span>
        <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', marginTop: 16 }}>You reach your potential everywhere else. It is time your health caught up.</h2>
        <p style={{ marginTop: 16, fontSize: 'clamp(16px,1.5vw,18px)', color: T.inkSoft, lineHeight: 1.6 }}>
          Wait another year and it only gets harder. Less energy, more weight, the same problem still waiting for you. It does not fix itself.
        </p>

        <div className="get-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 36, textAlign: 'left' }}>
          <div className="card">
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.moss, textTransform: 'uppercase', letterSpacing: '.06em' }}>Monthly</span>
            <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 28, color: T.ink, marginTop: 8 }}>$197 a month</div>
            <p style={{ marginTop: 8, fontSize: 14, color: T.inkSoft, lineHeight: 1.5 }}>Billed monthly, cancel anytime.</p>
          </div>
          <div className="card" style={{ borderColor: T.vital }}>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.moss, textTransform: 'uppercase', letterSpacing: '.06em' }}>6 Months, Save $185</span>
            <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 28, color: T.ink, marginTop: 8 }}>$997 once</div>
            <p style={{ marginTop: 8, fontSize: 14, color: T.inkSoft, lineHeight: 1.5 }}>Paid once. About $166 a month.</p>
          </div>
        </div>

        <p style={{ marginTop: 24, fontSize: 15, color: T.inkSoft, lineHeight: 1.6 }}>
          14 days. Do the check ins. If it is not for you, get every dollar back.
        </p>

        <div style={{ marginTop: 28 }}>{START()}</div>

        <p style={{ marginTop: 26, fontSize: 14.5, color: T.inkFaint, lineHeight: 1.6 }}>
          The old you said "be consistent this time." The new you follows a system that runs when your week falls apart.
        </p>
      </Wrap>
    </section>
  )
}

/* What happens after you join */
const AFTER = [
  { when: 'The moment you join', body: 'You get a welcome message from me, an invite to my training app, and a few short forms so I can build your plan around your real life. You are welcomed into the client community right away.' },
  { when: 'Within 24 hours of your forms', body: 'Your first nutrition and training plan is ready. You get a full walkthrough of the app, and how to reach me with questions between check ins.' },
  {when: 'Day 3', body: 'Your weight starts to drop. You feel just a little bit sharper in the afternoon. You spend no time thinking about what to do, instead you spend your energy on your work and your family.' },
  { when: 'Saturday', body: 'Your first check in. I look at how your week went.' },
  { when: 'Sunday', body: 'Your first round of adjustments lands. You know exactly what to do next.' },
]

function AfterJoin() {
  return (
    <section style={{ paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 720 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="eyebrow center">What happens after you join</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>The guessing stops the day you join.</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {AFTER.map((a, i) => (
            <div key={i} style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontFamily: T.mono, fontSize: 12.5, color: T.moss, letterSpacing: '.06em', textTransform: 'uppercase' }}>{a.when}</div>
              <p style={{ marginTop: 8, fontSize: 15.5, color: T.ink, lineHeight: 1.6 }}>{a.body}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 22, textAlign: 'center', fontSize: 'clamp(16px,1.5vw,18px)', color: T.inkSoft, lineHeight: 1.65 }}>
          By this time tomorrow you are not guessing anymore. You are finally feeling on track and certain about where your health is going. Joining creates certainty and eliminates overthinking. 
        </p>
      </Wrap>
    </section>
  )
}

/* The six month arc */
const ARC = [
  { when: 'Months 1 to 2', title: 'Foundation Reset', body: 'Your protocol goes in and you feel the first metabolic shifts.' },
  { when: 'Months 3 to 4', title: 'Adaptation', body: 'Your protocol gets refined based on your data. This is where most people plateau on their own. You will not.' },
  { when: 'Months 5 to 6', title: 'Lock In', body: 'Your results solidify into habits built to last.' },
]

function SixMonthArc() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 720 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="eyebrow center">Your six months</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>Here is how it unfolds.</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ARC.map((a, i) => (
            <div key={a.title} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: T.paper, border: `1px solid ${T.line}`, borderRadius: 14, padding: '22px 24px' }}>
              <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: T.forest, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 16 }}>{i + 1}</span>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 12, color: T.moss, letterSpacing: '.06em', textTransform: 'uppercase' }}>{a.when}</div>
                <h3 style={{ marginTop: 6, fontSize: 19 }}>{a.title}</h3>
                <p style={{ marginTop: 8, fontSize: 15.5, color: T.inkSoft, lineHeight: 1.6 }}>{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* FAQ */
const FAQS = [
  { q: 'I have tried other programs and nothing stuck. Why is this different?', a: "Most programs hand you a plan and leave you alone, or they push fat loss before the underlying metabolic picture supports it. We work on energy and build the structure first, in that order, and I stay on you the whole way. That is why it holds." },
  { q: 'What does week 1 actually look like?', a: "You get your first nutrition and training plan, built around your schedule, and you start right away. On Saturday I check in on how the week went. Sunday your first adjustments land, so you know exactly what to do next." },
  { q: 'Am I too old, too busy, or too far gone for this?', a: "No. I build the plan around your life, your joints, your schedule, and where you are starting from. Older, busier, or bigger just changes the plan. It does not change whether this works." },
  { q: 'I do not have much time. Will this work?', a: "Yes. This is built for someone with a job and a family. A few focused sessions a week, and a plan built around your schedule. It fits your life instead of taking it over." },
  { q: 'Do I need a gym?', a: "No. Home gym, a full gym, or no gym at all, I build your training around the equipment you have." },
  { q: 'What happens if I fall off track one week?', a: "You will have a bad week. That is week 4, not failure. Every man hits it. You will not be doing it alone, that is exactly when I step in." },
  { q: 'Will I actually work with Luke?', a: "Yes. Every check in comes from me. I send your weekly adjustments and I answer you during the week. You get me, not a bot and not a sub coach." },
  { q: 'How often do I actually hear from you?', a: "Your first plan lands within 24 hours of your forms. After that, a check in every Saturday and adjustments every Sunday. And you can message me with questions between check ins, with a response within 48 hours." },
  { q: 'What if it is not for me?', a: "You have 14 days. Do the check ins and follow the week 1 plan. If it is not for you, message me and get every dollar back. No forms." },
  { q: 'How much is it?', a: "$197 a month, cancel anytime. Or $997 once for 6 months, about $166 a month. Either way your first 14 days are covered by the refund, so you see the whole offer with no risk." },
  { q: 'Why does this cost more than an app or a free plan?', a: "An app cannot see you crash at 3pm or notice when your week falls apart. A free plan does not adjust when your life changes. You are not paying for information, you are paying for a coach who catches it and fixes it." },
  { q: 'How is this different from a generic program or another coach?', a: "There is no cookie cutter plan. You get me directly, not a sub coach, and a plan built around your actual life instead of a template. It is also built to survive a bad week instead of falling apart at the first one." },
  { q: 'Do I have to give up alcohol, train every day, or eat perfectly?', a: "No. Cheat meals are not a concept here, frequency matters more than perfection. Three or four sessions a week is enough, and your plan is built around your real life, not a strict list of rules." },
]

function FAQ() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 720 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="eyebrow center">Questions</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>Straight answers.</h2>
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

/* Your choice (closing) */
function YourChoice() {
  return (
    <section style={{ background: T.forest, color: '#fff', paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 640, textAlign: 'center' }}>
        <span className="eyebrow center vital">Your choice</span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>You have done harder things than this.</h2>
        <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.6vw,20px)', color: 'rgba(255,255,255,.86)', lineHeight: 1.65 }}>
          You build systems for everything else in your life, and you win. Your health just never had one. That is the only thing that has been missing.
        </p>
        <p style={{ marginTop: 16, fontSize: 'clamp(17px,1.6vw,20px)', color: '#fff', fontWeight: 600, lineHeight: 1.6 }}>
          The system is ready when you are. The choice is yours.
        </p>
        <div style={{ marginTop: 30 }}>{START()}</div>
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
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 17 }}>MetaShift Health</span>
          </div>
          <Link to="/buy" className="btn btn-vital">Start Now</Link>
        </div>
        <p style={{ marginTop: 20, color: 'rgba(255,255,255,.4)', fontSize: 12.5, lineHeight: 1.55 }}>
          © 2026 MetaShift Health. Coaching, not medical advice. Always work with your doctor for your own situation.
        </p>
      </Wrap>
    </footer>
  )
}

export default function LandingSalesPage() {
  useFonts()
  return (
    <div className="mroi-lp">
      <style>{CSS}</style>
      <Header />
      <main>
        {/* <VSL /> */}
        {/* <Belief /> */}
        <Proof />
        {/* Phases commented out for now — testing WhatYouGet standing alone.
            Revert or fold phase content into WhatYouGet based on how it reads live. */}
        {/* <Phases /> */}
        <WhatYouGet />
        <CourseCorrection />
        <BadWeek />
        <Fourteen />
        <AfterJoin />
        <SixMonthArc />
        <Offer />
        <FAQ />
        <YourChoice />
      </main>
      <Footer />
    </div>
  )
}
