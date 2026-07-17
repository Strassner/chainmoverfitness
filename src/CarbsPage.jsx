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

// Placeholder. Swap for the long-form YouTube video you want them to binge.
const LONGFORM_VIDEO_ID = 'ceAIiqaK_Kc'
const LONGFORM_URL = `https://www.youtube.com/watch?v=${LONGFORM_VIDEO_ID}`

/* ─── a partial pull from Luke's client food list ──────────────────── */
const CARBS = [
  { name: 'White potatoes', note: 'The most filling food per calorie there is. Nothing keeps you full like a potato.' },
  { name: 'Sweet potatoes', note: 'Filling, a little sweet, and loaded with the nutrients your body runs on.' },
  { name: 'Oats', note: 'Steady energy, and easy to prep ahead of a busy week.' },
  { name: 'Berries', note: 'Blueberries, strawberries, raspberries. High fiber, low sugar, top of the fruit list.' },
  { name: 'Apples', note: 'Fiber and water. One of the most filling fruits there is.' },
  { name: 'Orange juice', note: "Fights inflammation, feeds your metabolism, and gives you quick energy when you need it. One caveat: if you're extremely insulin resistant, skip it for now. I run those clients through my metabolic phase first, so they get to a point where they don't have to think about which carbs they eat for their blood sugar." },
]

export default function CarbsPage() {
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
        <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'block', marginBottom: 16 }}>
          Free resource
        </span>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
          The best carbs for fat loss
        </h1>
        <p style={{ marginTop: 18, marginBottom: 44, fontSize: 'clamp(16px,1.6vw,19px)', lineHeight: 1.6, color: T.inkSoft, maxWidth: 600 }}>
          Carbs were never the enemy. The right ones keep you full, steady your blood sugar, and let your metabolism work with you instead of against you. Start here.
        </p>

        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14, counterReset: 'carb' }}>
          {CARBS.map((c, i) => (
            <li key={c.name} style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, background: T.forest, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 16 }}>
                {i + 1}
              </span>
              <div>
                <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 19, color: T.ink }}>{c.name}</div>
                <p style={{ margin: '6px 0 0', fontSize: 15.5, lineHeight: 1.6, color: T.inkSoft }}>{c.note}</p>
              </div>
            </li>
          ))}
        </ol>

        <div style={{ marginTop: 32, background: T.mist, border: `1px solid ${T.line}`, borderRadius: 14, padding: '22px 24px' }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: T.ink }}>
            This is only part of the food list I hand my clients. I'm keeping the best of it back on purpose. The full ranking, the portions, and the swaps that make it actually click are what they pay me for. Even so, eating from what's here alone will move the needle.
          </p>
        </div>

        {/* ── CTA into long-form content ── */}
        <div style={{ marginTop: 48, background: `linear-gradient(160deg, ${T.forest} 0%, ${T.forest700} 100%)`, borderRadius: 20, padding: 'clamp(32px,5vw,48px)', textAlign: 'center', color: '#fff', boxShadow: T.shadow }}>
          <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.vital, display: 'block', marginBottom: 14 }}>Go deeper</span>
          <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(26px,3.6vw,40px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 16px' }}>
            This is the surface. The full breakdown is on YouTube.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,.88)', maxWidth: 520, margin: '0 auto 28px' }}>
            I break down exactly how to use carbs, fix your metabolism, and make fat loss the easy part. Start with this one and let the next play.
          </p>
          <a href={LONGFORM_URL} target="_blank" rel="noreferrer" aria-label="Watch on YouTube"
            style={{ display: 'block', position: 'relative', maxWidth: 520, margin: '0 auto', borderRadius: 16, overflow: 'hidden', aspectRatio: '16 / 9', background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.14)' }}>
            <img
              src={`https://img.youtube.com/vi/${LONGFORM_VIDEO_ID}/maxresdefault.jpg`}
              onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${LONGFORM_VIDEO_ID}/hqdefault.jpg` }}
              alt="Watch on YouTube"
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

        <p style={{ marginTop: 40, fontSize: 13.5, lineHeight: 1.6, color: T.inkFaint, fontStyle: 'italic' }}>
          Placeholder list. Educational only, not medical or nutritional advice for your specific situation.
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
