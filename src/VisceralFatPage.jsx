import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'

/* ─── brand tokens (match the rest of the site) ────────────────────── */
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

/* ─── deep link out to the "lose 100 lbs again" breakdown ─────────── */
const VIDEO_DEEPLINK = 'https://linktw.in/OxZFvB'
const VIDEO_THUMB_ID = 'N3APcaUKCjM'

const LEVERS = [
  { title: 'A fueled deficit', note: 'Eat less than you burn without starving your metabolism into stress mode.' },
  { title: 'Get insulin sensitive', note: 'The metabolic win that lets carbs work for you instead of against you.' },
  { title: 'Move', note: 'Steps, cardio, and strength — in the right dose, at the right time.' },
  { title: 'Sleep + stress', note: 'The lever most guys ignore, and the one that quietly parks fat around your middle.' },
]

/* ─── shared text styles ──────────────────────────────────────────── */
const P = { fontSize: 17, lineHeight: 1.75, color: T.inkSoft, margin: '0 0 18px' }
const H2 = { fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(24px,3.2vw,34px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: T.ink, margin: '48px 0 20px' }
const H3 = { fontFamily: T.display, fontWeight: 700, fontSize: 20, color: T.ink, margin: '28px 0 10px' }

export default function VisceralFatPage() {
  useFonts()

  return (
    <div style={{ background: T.paper, minHeight: '100svh', fontFamily: T.body, color: T.ink, display: 'flex', flexDirection: 'column' }}>

      {/* header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', height: 72 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }} />
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 760, width: '100%', margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', paddingBlock: 'clamp(40px,6vw,72px)' }}>

        {/* hero */}
        <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'block', marginBottom: 16 }}>
          Visceral fat
        </span>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
          Visceral fat is a metabolism problem, not a willpower problem
        </h1>
        <p style={{ marginTop: 18, fontSize: 'clamp(17px,1.7vw,20px)', lineHeight: 1.55, color: T.inkSoft, fontWeight: 500 }}>
          The belly fat you can't pinch is the one driving your health markers. Here's what it actually is, and why "just eat less" never touches it.
        </p>

        {/* Section 1: the two fats */}
        <h2 style={H2}>The two fats</h2>
        <p style={P}>Not all body fat behaves the same way, and lumping it together is why so much advice misses the point.</p>
        <p style={P}><strong style={{ color: T.ink }}>Subcutaneous fat</strong> is the fat right under your skin. You can pinch it. It's the fat people picture when they think "I need to lose weight."</p>
        <p style={P}><strong style={{ color: T.ink }}>Visceral fat</strong> is different. It sits deep, wrapped around your organs. You cannot pinch it, and a mirror can hide it. And visceral fat is the one actually driving your blood pressure, your blood sugar, and your long-term health risk.</p>

        {/* Section 2: why it's there */}
        <h2 style={H2}>Why it's there: the metabolic story</h2>
        <p style={P}>Visceral fat isn't random storage. It shows up when the liver is overwhelmed and your cells stop handling fuel well.</p>
        <p style={P}>The real driver is insulin resistance stacked on top of a stressed, under-fueled metabolism. Not a lack of discipline. A system that's stopped working the way it should.</p>
        <p style={{ ...P, fontWeight: 600, color: T.ink }}>And here's the part that catches people off guard: chronic dieting and chronic stress make it worse, not better. The "just eat less and grind harder" approach can actively feed the exact problem it's trying to solve.</p>

        {/* Section 3: skinny fat */}
        <h2 style={H2}>"Skinny fat" is real</h2>
        <p style={P}>A "fine" number on the scale doesn't mean you're safe. You can be thin everywhere else and still be carrying a dangerous amount of visceral fat.</p>
        <p style={P}>Thin limbs with a hard, round belly is a red flag, not a body type.</p>
        <div style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 14, padding: '20px 24px', margin: '4px 0 8px' }}>
          <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 17, color: T.ink, marginBottom: 6 }}>The simple home check</div>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: T.inkSoft }}>Your waist should be under half your height. At 6'0", that's under 36 inches. No scale, no calipers — just a tape measure.</p>
        </div>

        {/* Section 4: sugar reframe */}
        <h2 style={H2}>Sugar isn't the villain — but how you take it matters</h2>
        <p style={P}>This is where a lot of advice goes to extremes. It doesn't need to.</p>
        <p style={P}>Fruit sugar isn't your enemy. A broken metabolism is. A well-fueled body burns fuel instead of stress-storing it. The actual goal is becoming insulin sensitive, so carbs work for you instead of piling up as belly fat.</p>

        <h3 style={H3}>Whole fruit vs. liquid sugar</h3>
        <p style={P}>Whole fruit comes with fiber. It delivers slowly and keeps your liver happy — eat it. Straight juice and soda are fructose with the brakes cut, hitting your liver all at once. The dose and the delivery are the whole game, not the sugar itself.</p>

        <h3 style={H3}>Where OJ actually fits</h3>
        <p style={P}>Orange juice has real upside: vitamin C, potassium, and it can even blunt inflammation from a rough meal. But it's a garnish, not a strategy, especially if you're insulin resistant. Use it around training or with a meal, not as an all-day drip.</p>

        <div style={{ background: T.mist, border: `1px solid ${T.line}`, borderRadius: 14, padding: '22px 24px', margin: '8px 0 8px' }}>
          <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 17, color: T.ink, marginBottom: 6 }}>The honest rule</div>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: T.ink }}>In a deficit, moderate whole-food sugar is completely fine. What actually wrecks visceral fat isn't fruit — it's surplus calories plus a fatty, inflamed liver.</p>
        </div>

        {/* Section 5: the levers, teased not spelled out */}
        <h2 style={H2}>What actually shrinks it</h2>
        <p style={P}>Once the metabolism is the target instead of the scale, there are specific levers that move visceral fat, and good news: it's the first fat to leave once you're in a real, fueled deficit.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '4px 0 8px' }}>
          {LEVERS.map((l, i) => (
            <div key={l.title} style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 14, padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 9, background: T.forest, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 15 }}>
                {i + 1}
              </span>
              <div>
                <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 17, color: T.ink }}>{l.title}</div>
                <p style={{ margin: '4px 0 0', fontSize: 15.5, lineHeight: 1.6, color: T.inkSoft }}>{l.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={P}>Visceral fat is metabolic. Fix the metabolism, and the belly follows. But knowing the four levers isn't the same as knowing how to pull them in the right order without wrecking your energy or your hormones along the way.</p>

        {/* CTA into the video */}
        <div style={{ marginTop: 40, background: `linear-gradient(160deg, ${T.forest} 0%, ${T.forest700} 100%)`, borderRadius: 20, padding: 'clamp(32px,5vw,48px)', textAlign: 'center', color: '#fff', boxShadow: T.shadow }}>
          <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.vital, display: 'block', marginBottom: 14 }}>The fix</span>
          <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(26px,3.6vw,40px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 16px' }}>
            How I'd lose 100 lbs again, step by step
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,.88)', maxWidth: 560, margin: '0 auto 28px' }}>
            The full todo list — the fueled deficit, the insulin-sensitivity fix, the training split, the sleep piece — is laid out in this video, in the exact order I'd run it.
          </p>
          <a href={VIDEO_DEEPLINK} target="_blank" rel="noreferrer" aria-label="Watch the video on YouTube"
            style={{ display: 'block', position: 'relative', maxWidth: 560, margin: '0 auto', borderRadius: 16, overflow: 'hidden', aspectRatio: '16 / 9', background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.14)' }}>
            <img
              src={`https://img.youtube.com/vi/${VIDEO_THUMB_ID}/maxresdefault.jpg`}
              onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${VIDEO_THUMB_ID}/hqdefault.jpg` }}
              alt="Watch the video"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <span style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.2)' }} />
            <svg viewBox="0 0 68 48" width="76" height="54" aria-hidden="true"
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.45))' }}>
              <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#FF0000" />
              <path d="M45,24 27,14 27,34 Z" fill="#fff" />
            </svg>
          </a>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', textAlign: 'center', margin: '14px 0 0' }}>Opens on YouTube</p>
        </div>

        {/* footer note */}
        <p style={{ marginTop: 44, paddingTop: 24, borderTop: `1px solid ${T.line}`, fontSize: 13.5, lineHeight: 1.6, color: T.inkFaint }}>
          Educational only, not medical advice. Visceral fat is linked to serious health risks — talk to your doctor about your own numbers, especially if your waist-to-height check comes back high.
        </p>
      </main>

      {/* footer */}
      <footer style={{ background: T.ink, color: '#fff', paddingBlock: 40, marginTop: 64 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.display, fontWeight: 800, fontSize: 18 }}>
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 32, width: 'auto', objectFit: 'contain', display: 'block' }} />
            Chainmover Fitness
          </div>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>© 2026 Chainmover Fitness. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
