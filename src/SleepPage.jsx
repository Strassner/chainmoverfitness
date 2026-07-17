import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'

/* ─── video (same deep-link-to-YouTube thumbnail as the results VSL) ── */
const PLAN_VIDEO_ID = 'ceAIiqaK_Kc'
const PLAN_VIDEO_URL = `https://www.youtube.com/watch?v=${PLAN_VIDEO_ID}`

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

/* ─── content ──────────────────────────────────────────────────────── */
const STEPS = [
  {
    title: 'Sleep on your side, not your back.',
    body: "When you lie on your back, your tongue and throat fall backward and close the airway faster. Sleeping on your side keeps it open. Put a firm pillow behind your back so you cannot roll over in your sleep. This one change alone quiets the snoring for a lot of big guys.",
  },
  {
    title: 'No alcohol within 3 hours of bed.',
    body: "Alcohol relaxes the muscles in your throat even more than normal sleep does. Even two drinks makes the airway collapse harder and blocks your deep sleep. Cut it off 3 hours before bed and you will feel the difference in one night.",
  },
  {
    title: 'Prop the head of your bed up.',
    body: "Raise the head of your bed 4 to 6 inches. Put a couple of books under the legs, or use a wedge pillow. Sleeping on a slight incline uses gravity to keep the airway open and keeps stomach acid down, which also makes breathing easier. Stacking regular pillows does not work as well, it just bends your neck. If you can't raise the whole top of the bed, stacking pillows is certainly better than nothing.",
  },
]

/* ─── shared paragraph style ───────────────────────────────────────── */
const P = { fontSize: 17, lineHeight: 1.75, color: T.inkSoft, margin: '0 0 18px' }
const H2 = { fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(24px,3.2vw,34px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: T.ink, margin: '48px 0 20px' }

export default function SleepPage() {
  useFonts()

  return (
    <div style={{ background: T.paper, minHeight: '100svh', fontFamily: T.body, color: T.ink, display: 'flex', flexDirection: 'column' }}>

      {/* header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', height: 72 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }} />
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', paddingBlock: 'clamp(40px,6vw,72px)' }}>

        {/* hero */}
        <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'block', marginBottom: 16 }}>
          Sleep and snoring
        </span>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
          Why big guys snore, and 3 things you can do tonight
        </h1>
        <p style={{ marginTop: 18, fontSize: 'clamp(17px,1.7vw,20px)', lineHeight: 1.55, color: T.inkSoft, fontWeight: 500 }}>
          Read this before you accept the CPAP for the rest of your life.
        </p>

        {/* Section 1 */}
        <h2 style={H2}>The truth nobody told you</h2>
        <p style={P}>You have probably been told the same thing by every doctor. "You snore because you are heavy. Lose the weight or wear the machine."</p>
        <p style={P}>That is only half true, and the half they left out is the part that actually helps you tonight.</p>
        <p style={P}>Here is what is really happening. When you carry extra weight, soft tissue builds up around your throat and airway. When you lie down and fall asleep, the muscles there relax. For a big guy, that airway is already crowded, so it collapses and closes. Your breathing stops for a few seconds. Your brain panics, jolts you half awake to open the airway, and you gasp or snore. This happens over and over all night. You never feel it, but it wrecks your deep sleep.</p>
        <p style={P}>That is why you wake up tired even after 8 hours. That is the brain fog. That is why you are starving and reaching for sugar by 2pm. Your body never got to recover.</p>
        <p style={P}>The weight is the real root. But there are things you can do tonight to open that airway a little more while you work on losing it.</p>

        {/* Section 2 */}
        <h2 style={H2}>3 things you can do tonight</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 14, padding: '22px 24px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: T.forest, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 17 }}>
                {i + 1}
              </span>
              <div>
                <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 19, color: T.ink, marginBottom: 8 }}>{s.title}</div>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: T.inkSoft }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...P, margin: '22px 0 0' }}>Do these three tonight. You will not fix the root, but you will breathe easier and sleep deeper by the morning.</p>

        {/* Section 3 */}
        <h2 style={H2}>The part that matters most</h2>
        <p style={P}>Here is the hard truth, and I am telling you this because no one else will.</p>
        <p style={P}>These three steps help. But they do not fix the cause. The cause is the extra weight sitting on your airway, and sleep apnea does not stay the same over time. It gets worse.</p>
        <p style={P}>The worse your sleep gets, the higher your cortisol runs, the more your body holds fat and craves sugar. That extra weight crowds the airway even more. Which makes the apnea worse. Which makes the weight harder to lose. It feeds itself, and every year it gets tighter.</p>
        <p style={P}>And it is not just about being tired. Untreated sleep apnea is linked to high blood pressure, heart problems, and stroke. This is not a snoring problem. It is a health problem with a clock on it.</p>
        <p style={P}>The only thing that actually stops the cycle is losing the weight, in a way that fixes the metabolism underneath it instead of starving yourself for a few weeks and gaining it back.</p>
        <p style={P}>That is exactly what I built the MROI method to do. I put the full breakdown in a short video below. It shows you why the weight came on, why it will not come off with a normal diet, and the exact steps to reverse it so the apnea goes away for good.</p>
        <p style={{ ...P, fontWeight: 600, color: T.ink }}>Watch it now while this is fresh.</p>

        {/* video (deep link out to YouTube) */}
        <a href={PLAN_VIDEO_URL} target="_blank" rel="noreferrer" aria-label="Watch the video on YouTube"
          style={{ display: 'block', position: 'relative', marginTop: 8, borderRadius: 16, overflow: 'hidden', aspectRatio: '16 / 9', background: '#000', boxShadow: T.shadow, border: `1px solid ${T.line}` }}>
          <img
            src={`https://img.youtube.com/vi/${PLAN_VIDEO_ID}/maxresdefault.jpg`}
            onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${PLAN_VIDEO_ID}/hqdefault.jpg` }}
            alt="Watch the video"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <span style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.2)' }} />
          <svg viewBox="0 0 68 48" width="82" height="58" aria-hidden="true"
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.45))' }}>
            <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#FF0000" />
            <path d="M45,24 27,14 27,34 Z" fill="#fff" />
          </svg>
        </a>
        <p style={{ fontSize: 13.5, color: T.inkFaint, textAlign: 'center', margin: '14px 0 0' }}>Opens on YouTube</p>

        {/* footer note */}
        <p style={{ marginTop: 44, paddingTop: 24, borderTop: `1px solid ${T.line}`, fontSize: 13.5, lineHeight: 1.6, color: T.inkFaint }}>
          This is not medical advice. Sleep apnea is a serious condition. Keep working with your doctor, and if you use a CPAP, keep using it. These steps stack on top of your care, they do not replace it.
        </p>
      </main>

      {/* footer */}
      <footer style={{ background: T.ink, color: '#fff', paddingBlock: 40, marginTop: 64 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
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
