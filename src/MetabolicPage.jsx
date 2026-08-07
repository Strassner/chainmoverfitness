import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'
import coachTransformation from './assets/CoachLukeBeforeAfter.jpg'
import larryTransformation from './assets/LarryBeforeAfterJuly28.jpg'
import danielTransformation from './assets/DanielBeforeAfterJuly28.jpg'
import gabeTransformation from './assets/GabeBeforeAfterJuly28.jpg'
import { QuoteGrid, FeaturedTransformation, PersonStoryFeature } from './proofUtils'

/* ══════════════════════════════════════════════════════════════════════
   /metabolic — metabolic health / insulin resistance positioning.
   Call-booking funnel: every CTA goes to /apply, never to /buy.
   Fully self-contained. All styles scoped under `.mroi-met`.
   ══════════════════════════════════════════════════════════════════════ */

/* Every CTA lands here. The ?src= is read by ApplicationPage so leads
   from this page are attributable in the Apps Script sheet (quiz traffic
   carries a sessionStorage lead object, this traffic does not). */
const APPLY_URL = '/apply?src=metabolic'

/* Real capacity, not a countdown. 45 clients at a time, 4-8 spots
   opening a month. If these numbers change, change them here. */
const CAPACITY_LINE = '45 clients at a time · typically 4 to 8 spots open each month'

/* Price floor shown on the page. Honest against the async 12 month tier
   ($2,500 / 12 months = $48 a week). No ceiling is published: the tier
   conversation happens on the call. */
const PRICE_FLOOR = '$47 a week'

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
    .mroi-met .sym-grid { grid-template-columns: 1fr !important; }
    .mroi-met .phase-grid { grid-template-columns: 1fr !important; }
    .mroi-met .safety-grid { grid-template-columns: 1fr !important; }
    .mroi-met .transform-photo img { height: auto !important; min-height: 0 !important; aspect-ratio: 3 / 2; }
  }
  @media (max-width: 620px) { .mroi-met .proof-grid { grid-template-columns: 1fr !important; } }
`

function Wrap({ children, style }) {
  return <div style={{ maxWidth: 860, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', ...style }}>{children}</div>
}

/* Single CTA helper — rendered at every decision point on the page.
   Same label and same destination everywhere, so it reads as one
   decision the reader keeps meeting rather than several asks. */
const APPLY = (extra, label = 'Apply to work with Luke') => (
  <Link to={APPLY_URL} className="btn btn-vital btn-lg" style={extra}>{label}</Link>
)

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 16, height: 16, color: T.vital, flexShrink: 0, marginTop: 5 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* ─── 1. Header + hero ─────────────────────────────────────────────── */
function Header() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ background: T.forest, color: '#fff', textAlign: 'center', padding: '9px 16px', fontFamily: T.mono, fontSize: 12.5, letterSpacing: '.02em' }}>
          {CAPACITY_LINE}
        </div>
        <Wrap>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, gap: 16 }}>
            <Link to="/metabolic" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
            </Link>
            <Link to={APPLY_URL} className="btn btn-vital" style={{ padding: '12px 24px', fontSize: 15 }}>Apply now</Link>
          </div>
        </Wrap>
      </header>

      <section style={{ background: `radial-gradient(120% 120% at 50% -10%,${T.mist} 0%,rgba(232,241,234,0) 55%),${T.paper}`, paddingTop: 'clamp(44px,6vw,80px)', paddingBottom: 'clamp(44px,6vw,72px)' }}>
        <Wrap style={{ textAlign: 'center' }}>
          <span className="eyebrow center" style={{ marginBottom: 18 }}>Metabolic health · Insulin resistance · Fat loss</span>
          <h1 style={{ fontSize: 'clamp(36px,5.6vw,60px)' }}>Eating less stopped working.</h1>
          <p style={{ marginTop: 18, fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(18px,2.2vw,25px)', color: T.forest, lineHeight: 1.3, letterSpacing: '-0.01em', maxWidth: 660, marginInline: 'auto' }}>
            When the diet that took off the first 30 pounds quits on you, the problem is not your willpower. It is insulin. Fix that first and the weight comes off while you eat more food, not less.
          </p>

          <div style={{ marginTop: 30 }}>{APPLY()}</div>
          <p style={{ marginTop: 16, fontFamily: T.mono, fontSize: 13, color: T.inkFaint }}>
            Plans start as low as {PRICE_FLOOR}
          </p>
        </Wrap>
      </section>
    </>
  )
}

/* ─── 2. Recognition ───────────────────────────────────────────────── */
const SYMPTOMS = [
  'You eat less than the people around you, and you are the one still gaining.',
  'The diet that took off the first 30 pounds stopped working, so you cut further.',
  'You are starving on low carb, and now you are afraid of rice, bread and potatoes.',
  'Your bloodwork came back normal and you still feel terrible.',
  'You sleep eight hours and wake up like a train hit you overnight.',
  'You have lost the same 30 pounds three separate times.',
]

function Symptoms() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(56px,8vw,100px)' }}>
      <Wrap>
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 38 }}>
          <span className="eyebrow center">Sound familiar</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>None of this is a discipline problem.</h2>
        </div>

        <div className="sym-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {SYMPTOMS.map(s => (
            <div key={s} className="card" style={{ background: T.paper, display: 'flex', gap: 12, alignItems: 'flex-start', padding: '20px 22px' }}>
              {CHECK}
              <p style={{ fontSize: 16, lineHeight: 1.55, color: T.ink }}>{s}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 30, textAlign: 'center', fontSize: 17, color: T.inkSoft, lineHeight: 1.65, maxWidth: 620, marginInline: 'auto' }}>
          One client brought his food log to his doctor. The doctor looked at it and told him he was eating well underneath his maintenance, and that he was still going to have to write down obese. That is not a willpower story. That is a metabolism that has stopped cooperating.
        </p>
      </Wrap>
    </section>
  )
}

/* ─── 3. The mechanism — the centerpiece of the page ───────────────── */
function Mechanism() {
  return (
    <section style={{ background: T.forest, color: '#fff', paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap>
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 38 }}>
          <span className="eyebrow center vital">What is actually happening</span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(28px,4vw,46px)', marginTop: 16 }}>Your cells are locked doors. Insulin is the key.</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680, marginInline: 'auto', fontSize: 'clamp(16px,1.6vw,18.5px)', lineHeight: 1.7, color: 'rgba(255,255,255,.86)' }}>
          <p>
            Food becomes blood sugar. To get that sugar inside a cell and turn it into energy, your body needs insulin. Think of every cell as a locked door, and insulin as the key that opens it.
          </p>
          <p>
            When there is too much sugar in the blood for too long, your body just makes more keys. Then the locks start ignoring them. Now it takes two keys to open one door. Then three. Your body keeps up by flooding the system with insulin.
          </p>
          <p style={{ color: '#fff', fontWeight: 600 }}>
            Here is the part nobody explains. You can be insulin resistant and still have perfectly normal blood sugar. Your body is simply producing three times the insulin to hold it there. Your labs read fine. You feel awful.
          </p>
          <p>
            Fasting glucose and A1c are lagging indicators. They are the moment insulin finally stops keeping up. You can be insulin resistant for years before either number moves, which is why so many people get told everything looks good while nothing feels good.
          </p>
          <p>
            That is where the afternoon crash comes from. The brain fog. The fat that goes on easily and comes off slowly. And it is why cutting harder keeps failing, because cutting harder was never aimed at the actual problem.
          </p>
        </div>

        <div style={{ marginTop: 36, maxWidth: 680, marginInline: 'auto', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.16)', borderRadius: 18, padding: 'clamp(24px,3vw,32px)' }}>
          <p style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(19px,2.2vw,23px)', color: '#fff', lineHeight: 1.35 }}>
            This is the first thing we work on together. Not the last.
          </p>
          <p style={{ marginTop: 12, fontSize: 16, color: 'rgba(255,255,255,.78)', lineHeight: 1.65 }}>
            Before we touch cardio, before we push fat loss, we get your body handling carbohydrates properly again. That is what makes everything after it work.
          </p>
        </div>

        <div style={{ marginTop: 34, textAlign: 'center' }}>{APPLY()}</div>
      </Wrap>
    </section>
  )
}

/* ─── 4. Why every diet worked, then stalled ───────────────────────── */
function RaceToTheBottom() {
  return (
    <section style={{ paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 720 }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <span className="eyebrow center">Why it always stalls</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>Every diet works for three weeks.</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: T.inkSoft }}>
          <p>
            Cut the carbs and you drop five or six pounds in a week. Most of that is water. Your muscles stop holding glycogen, inflammation comes down, and the scale rewards you for it. You feel like you finally cracked it.
          </p>
          <p>
            Then it stops. Because nothing underneath actually changed. You emptied the tank, you never started using the fat.
          </p>
          <p>
            So you cut a little more. Then you add cardio. Then you cut again. Every plateau costs you another few hundred calories or another session on the treadmill, and the target keeps moving down.
          </p>
        </div>

        <blockquote style={{ margin: '30px 0 0', background: T.bone, border: `1px solid ${T.line}`, borderLeft: `4px solid ${T.vital}`, borderRadius: 14, padding: 'clamp(22px,3vw,30px)' }}>
          <p style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(19px,2.3vw,25px)', lineHeight: 1.35, color: T.ink }}>
            “How much longer am I going to have to do this before I am not eating anything?”
          </p>
          <footer style={{ marginTop: 14, fontFamily: T.mono, fontSize: 12.5, color: T.moss }}>
            A client, on his fourth calorie cut in a year
          </footer>
        </blockquote>

        <p style={{ marginTop: 26, fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: T.ink, fontWeight: 600 }}>
          That is a race to the bottom, and there is no bottom. Cardio is a tool here, not a requirement. The smallest change that keeps the weight moving is always the right one, because it leaves you somewhere to go when things stall.
        </p>
      </Wrap>
    </section>
  )
}

/* ─── 5. The four phases ───────────────────────────────────────────── */
const PHASES = [
  { letter: 'M', title: 'Metabolic', body: 'The first thing you notice is energy, and the scale starts moving again. You eat more carbs here, not fewer. We get your body processing food and using it right away instead of storing it and leaving you foggy and crashing at 3pm.' },
  { letter: 'R', title: 'Recovery', body: 'Now we fix sleep, stress and joints. The bad back or the bad knees, we work on them and around them. Same hours in bed, except you wake up rested. Most people are down 15 to 40 pounds by the end of these first two phases.' },
  { letter: 'O', title: 'Optimize', body: 'The groundwork is laid, so this is where we press. This is the fastest stretch of fat loss in the whole program, and it works precisely because we did not start here.' },
  { letter: 'I', title: 'Identity', body: 'The part almost every program skips. Plenty of people lose the weight and still see the old version in the mirror, and that is the version that puts it back on. We work on this the entire way through, not at the end.' },
]

function Phases() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap>
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 40 }}>
          <span className="eyebrow center">The method</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>Four phases, in this order.</h2>
          <p style={{ marginTop: 16, fontSize: 17, color: T.inkSoft, lineHeight: 1.6 }}>
            The order is the whole point. How you lose the weight is exactly how you will keep it off.
          </p>
        </div>

        <div className="phase-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {PHASES.map(p => (
            <div key={p.letter} className="card" style={{ background: T.paper }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: T.forest, color: T.vital, display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 19, flexShrink: 0 }}>{p.letter}</span>
                <h3 style={{ fontSize: 21 }}>{p.title}</h3>
              </div>
              <p style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.6, color: T.inkSoft }}>{p.body}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── 6. Proof ─────────────────────────────────────────────────────── */
const FEATURED_TRANSFORMATIONS = [
  { name: 'Larry', stat: 'Down 45 lbs in 5 months', quote: "Other coaches felt like I got handed off to a stranger. With Luke I actually get Luke. If I don't have enough communication it doesn't work for me, and this works.", photo: larryTransformation },
  { name: 'Daniel', stat: 'Down 85 lbs', quote: "Two months in, people are noticing. I get compliments from family, coworkers, friends. I can't recall the last time I felt this confident.", photo: danielTransformation },
  { name: 'Gabe', stat: 'Down 25 lbs in 3 months, engineer', quote: "My clothes fit better and my energy is back. I finally feel like I can do this. It's not just a pipe dream anymore.", photo: gabeTransformation },
]

const QUOTES = [
  { name: 'Mike', stat: 'Retired, 55 · A1c 7.0 to 6.3 in one month', quote: "I'd been through three different doctors and two medications and nobody could tell me why the weight wouldn't move or help me. Five weeks with Luke, I ate more than I had in years and broke 300 for the first time without a drug doing it for me." },
  { name: 'JD', stat: 'Father of two, 47', quote: "I was 280 when I got married in 2005. In 2025 I was 380. Now I'm very close to leaving the 300 lbs club and coming into the 200 club." },
  { name: 'Sascha', stat: 'Father, entrepreneur', quote: "First time in years the scale is going the right way. I broke 230 in the first couple of weeks. Can't tell you the last time I've been this low. My nutrition is dialed in and the weight is moving." },
  { name: 'Wyatt', stat: 'Doctor of Chiropractic Medicine, down 14 lbs in 7 weeks', quote: "You're not just doing a little bit of exercise and a little bit of nutrition. You get down to the details. That's what makes me think you know what you're doing." },
]

/* The marker the whole page is about, moving on a real client. Deliberately
   numeric rather than a LabProofCard — we have no lab screenshots yet, and
   that component renders "add image" placeholders without them.
   Framed as what happened to Mike, not as a promise: 6.3 is out of the
   type 2 range but still above the 5.7 pre-diabetes line, and saying so
   is both accurate and more believable than rounding it up to a win. */
function MarkerMove() {
  return (
    <div style={{ background: T.forest, color: '#fff', borderRadius: 20, padding: 'clamp(28px,3.5vw,40px)', marginBottom: 24, boxShadow: T.shadowLg }}>
      <span className="eyebrow vital">The marker that matters</span>
      <h3 style={{ color: '#fff', fontSize: 'clamp(22px,2.8vw,30px)', marginTop: 12 }}>
        Mike’s A1c went from 7.0 to 6.3 in one month.
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
        A1c above 6.5 is the type 2 range. Above 5.7 is pre-diabetic. Mike started at 350 pounds on two medications, and one month of working on his insulin first moved him out of the diabetic range. He is not finished, he is still above 5.7, and he is still going. That is the number this whole page is about.
      </p>
    </div>
  )
}

function Proof() {
  return (
    <section style={{ paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap>
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 44 }}>
          <span className="eyebrow center">Real clients. Real results.</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', marginTop: 16 }}>I was there. I found the way out.</h2>
        </div>

        <PersonStoryFeature
          T={T}
          photoSrc={coachTransformation}
          photoAlt="Coach Luke, before and after"
          headline="I was 300 pounds and pre-diabetic."
          paragraphs={[
            'I was obese most of my life. I played offensive line, so being big had a place. Then I stopped playing and it caught up with me all at once.',
            'Then I overcorrected. I ate less and moved more until my fingers turned purple sitting at my desk, because chronic restriction on top of hard training had pushed my thyroid into the floor. That is when I stopped guessing and learned how this actually works. It is the same thing I run you through now.',
          ]}
        />

        <MarkerMove />

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

        <span className="eyebrow center" style={{ display: 'block', textAlign: 'center', marginBottom: 18 }}>In their words</span>
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

/* ─── 7. Investment ────────────────────────────────────────────────── */
function Investment() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 680, textAlign: 'center' }}>
        <span className="eyebrow center">The investment</span>
        <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>Plans start as low as {PRICE_FLOOR}.</h2>

        <p style={{ marginTop: 22, fontSize: 'clamp(17px,1.7vw,19.5px)', color: T.inkSoft, lineHeight: 1.7 }}>
          I run several programs, and which one fits depends on how much support we decide you actually need. Some people need me in their phone every day. Some need a plan and a weekly check in. We work that out on the call.
        </p>
        <p style={{ marginTop: 18, fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(19px,2.2vw,24px)', color: T.forest, lineHeight: 1.35 }}>
          I would never want money to be the reason I could not help someone.
        </p>

        <div style={{ marginTop: 30 }}>{APPLY()}</div>
      </Wrap>
    </section>
  )
}

/* ─── 8. Risk reversal ─────────────────────────────────────────────── */
const SAFETY = [
  {
    title: 'Your first week is on me',
    body: 'Apply and get accepted today and your program clock starts the following Monday. You get the app, your intake, and your first week before you are paying for any of it.',
  },
  {
    title: 'Seven days to change your mind',
    body: 'If it is not right for you, message me inside the first seven days and I will refund you in full. If you want that in writing with my signature before you start, ask and I will send it.',
  },
]

function Safety() {
  return (
    <section style={{ paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 760 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="eyebrow center">Before you commit</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>Two ways this sits on me, not you.</h2>
        </div>

        <div className="safety-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {SAFETY.map((s, i) => (
            <div key={s.title} className="card" style={{ background: T.paper }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: T.forest, color: T.vital, display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 15 }}>{i + 1}</span>
              <h3 style={{ fontSize: 20, marginTop: 14 }}>{s.title}</h3>
              <p style={{ marginTop: 10, fontSize: 15.5, lineHeight: 1.6, color: T.inkSoft }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* Conditions carry the same visual weight as the promise above —
            a guarantee's material terms have to be disclosed as
            prominently as the guarantee itself. */}
        <div style={{ marginTop: 16, border: `1px solid ${T.line}`, borderRadius: 16, padding: 'clamp(20px,3vw,26px)', background: T.bone }}>
          <h4 style={{ fontSize: 15, fontFamily: T.display }}>How the refund works</h4>
          <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              'The seven days run from your program start date, not from the day you apply.',
              'Request it by messaging Luke directly in the app. There is no form and no retention call.',
              'Refunds are processed back to your original payment method within 5 business days.',
              'After day seven, refunds are at Luke’s discretion.',
            ].map(c => (
              <li key={c} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, color: T.inkSoft, lineHeight: 1.55 }}>
                {CHECK}{c}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 34, textAlign: 'center' }}>{APPLY()}</div>
      </Wrap>
    </section>
  )
}

/* ─── 9. Who this is not for ───────────────────────────────────────── */
const NOT_FOR = [
  'You want a meal plan PDF and no contact with anybody.',
  'You want the fastest possible number on the scale and you do not care what happens after.',
  'You are not willing to tell me honestly how your week actually went.',
  'You are looking for someone to agree with you rather than coach you.',
]

function NotForYou() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(56px,8vw,100px)' }}>
      <Wrap style={{ maxWidth: 680 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="eyebrow center">Straight with you</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>This is not for everyone.</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {NOT_FOR.map(n => (
            <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: T.paper, border: `1px solid ${T.line}`, borderRadius: 14, padding: '18px 20px' }}>
              <span style={{ color: T.inkFaint, fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>&times;</span>
              <p style={{ fontSize: 16, lineHeight: 1.55, color: T.inkSoft }}>{n}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 16.5, color: T.ink, lineHeight: 1.65 }}>
          If none of those are you, apply. If the call tells us both this is not a fit, I will say so and point you somewhere better.
        </p>
      </Wrap>
    </section>
  )
}

/* ─── 10. FAQ ──────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'How much does it cost?', a: 'Plans start as low as $47 a week. I run several programs and the right one depends on how much support you need, so we settle that on the call rather than putting you into a tier you did not pick.' },
  { q: 'Do I have to cut carbs?', a: 'No, and that is the point. The goal is to have you eating more carbs than you are eating right now and still losing weight. Being afraid of rice or bread for the rest of your life is not a plan, it is a sentence.' },
  { q: 'Do I have to count calories forever?', a: 'No. You will track for the first month or two, because that is the fastest way to understand what is actually in your food. After that we move you to eating intuitively. You should not be logging every meal ten years from now.' },
  { q: 'What if my bloodwork is normal?', a: 'That is common, and it is exactly why this gets missed. Fasting glucose and A1c are lagging indicators, so they only move once insulin is already failing to keep up. Feeling foggy, crashing in the afternoon and gaining easily can all show up years before a lab number does.' },
  { q: 'Can you reverse my insulin resistance or pre-diabetes?', a: 'I am a coach, not a doctor, so I will not promise that and you should be careful with anyone who does. What I do is coach the daily behaviors — food, training, sleep, stress and steps — that support better metabolic health. Clients have seen real changes in their markers. You keep your physician in the loop the whole way.' },
  { q: 'What if I am on medication, or on a GLP-1?', a: 'Plenty of clients start on blood pressure, metformin or a GLP-1. Nothing here asks you to stop or change a prescription, that is between you and your doctor. Tell me on the call what you are taking and I will build around it.' },
  { q: 'How much cardio is in this?', a: 'Probably less than you expect. Cardio is a tool, not a requirement. I would rather hold it in reserve so there is somewhere to go when we hit a plateau, instead of spending it in week one.' },
  { q: 'I am too busy for this.', a: 'If a plan only works during the calm weeks of your life, it does not work. Your plan gets built for your worst week, not your best one, because those are the weeks that decide whether this holds.' },
  { q: 'Do I need a gym?', a: 'No. Home setup, full gym or nothing at all, the training gets built around the equipment you actually have.' },
  { q: 'What if I have a bad week?', a: 'You will have one. That is week 4, not failure. Everybody hits it, and that is the week I step in rather than the week you disappear.' },
  { q: 'Do I actually work with you, or a sub coach?', a: 'Me. I keep capacity at 45 clients on purpose so every check in and every adjustment comes from me directly.' },
  { q: 'What happens on the call?', a: 'We go through where you are, what you have tried and what your bloodwork looks like if you have it. You leave understanding what is actually going on in your body. If we both think it is a fit, we talk about which program makes sense.' },
]

function FAQ() {
  return (
    <section style={{ paddingBlock: 'clamp(56px,8vw,110px)' }}>
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

/* ─── 11. Closer ───────────────────────────────────────────────────── */
function Closer() {
  return (
    <section style={{ background: T.forest, color: '#fff', paddingBlock: 'clamp(56px,8vw,110px)' }}>
      <Wrap style={{ maxWidth: 640, textAlign: 'center' }}>
        <span className="eyebrow center vital">Your move</span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(28px,4vw,44px)', marginTop: 16 }}>Another year of this only makes it harder.</h2>
        <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.6vw,20px)', color: 'rgba(255,255,255,.86)', lineHeight: 1.65 }}>
          Insulin resistance does not hold steady while you decide. It gets a little worse, quietly, and the number on the scale is the last thing to tell you about it.
        </p>
        <p style={{ marginTop: 16, fontSize: 'clamp(17px,1.6vw,20px)', color: '#fff', fontWeight: 600, lineHeight: 1.6 }}>
          One call. You will understand your own body better either way.
        </p>
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
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 17 }}>Chainmover Fitness</span>
          </div>
          <Link to={APPLY_URL} className="btn btn-vital">Apply now</Link>
        </div>
        <p style={{ marginTop: 20, color: 'rgba(255,255,255,.4)', fontSize: 12.5, lineHeight: 1.55 }}>
          © 2026 Chainmover Fitness. Coaching, not medical advice. Nothing here diagnoses, treats or replaces care from your physician. Always work with your doctor on your own situation, and never start, stop or change a medication based on anything on this page.
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
        <Symptoms />
        <Mechanism />
        <RaceToTheBottom />
        <Phases />
        <Proof />
        <Investment />
        <Safety />
        <NotForYou />
        <FAQ />
        <Closer />
      </main>
      <Footer />
    </div>
  )
}
