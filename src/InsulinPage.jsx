import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import chainmoverLogo from './assets/ChainmoverLogo.png'

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

// Same walkthrough the bucket pages point at — one video, one message.
const PLAN_VIDEO_ID = 'p5sdrV7PAso'
const QUIZ_URL = '/quiz?src=insulin'

/* The signs people actually notice, before a lab ever flags anything. */
const SIGNS = [
  'You crash an hour or two after eating, and reach for more food to climb back out.',
  'The weight sits around your midsection and stays there, no matter what the scale does elsewhere.',
  'You are hungry again well before you should be, and it is carbs you want, not food in general.',
  'Afternoons are a fog. Focus costs more than it used to.',
  'You sleep enough hours and still wake up tired.',
  'Skin tags, or dark velvety patches on your neck, armpits or groin.',
  'Your labs came back "borderline" or "nothing to worry about yet", and nobody explained what to do about it.',
  'The exact effort that used to work has stopped working.',
]

export default function InsulinPage() {
  useFonts()
  const [playing, setPlaying] = useState(false)

  const frame = { display: 'block', position: 'relative', width: '100%', maxWidth: 620, margin: '0 auto', borderRadius: 16, overflow: 'hidden', aspectRatio: '16 / 9', background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.14)' }
  const P = { fontSize: 'clamp(16px,1.6vw,17.5px)', lineHeight: 1.75, color: T.inkSoft, margin: '0 0 18px' }

  return (
    <div style={{ background: T.paper, minHeight: '100svh', fontFamily: T.body, color: T.ink, display: 'flex', flexDirection: 'column' }}>

      {/* header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', height: 72 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={chainmoverLogo} alt="" style={{ height: 34, width: 'auto', objectFit: 'contain', display: 'block' }} />
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: T.ink, whiteSpace: 'nowrap' }}>Chainmover Coaching</span>
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 760, width: '100%', margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', paddingBlock: 'clamp(40px,6vw,64px)' }}>

        {/* ── hero: name the problem ── */}
        <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'block', marginBottom: 16 }}>
          Insulin resistance
        </span>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
          It was never your willpower.
        </h1>
        <p style={{ marginTop: 18, marginBottom: 40, fontSize: 'clamp(17px,1.7vw,20px)', lineHeight: 1.6, color: T.inkSoft, maxWidth: 620 }}>
          You have cut calories. You have cut carbs. You have done the work, and the midsection has not moved. That is not a discipline problem. It is a metabolic one, and it has a name.
        </p>

        {/* ── agitate: the signs ── */}
        <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(24px,3.2vw,34px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: T.ink, margin: '0 0 20px' }}>
          How many of these are yours?
        </h2>
        <ul style={{ listStyle: 'none', margin: '0 0 20px', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SIGNS.map((s) => (
            <li key={s} style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 12, padding: '15px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10" fill={T.vitalSoft} />
                <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke={T.forest} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 16, lineHeight: 1.6, color: T.ink }}>{s}</span>
            </li>
          ))}
        </ul>
        <p style={{ ...P, fontWeight: 600, color: T.ink, marginBottom: 44 }}>
          Three or more, and you are almost certainly looking at insulin resistance.
        </p>

        {/* ── what it is: short, mechanism only ── */}
        <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(24px,3.2vw,34px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: T.ink, margin: '0 0 20px' }}>
          What it actually is
        </h2>
        <p style={P}>
          Insulin's job is to move sugar out of your blood and into your cells. When those cells stop listening, your pancreas does the obvious thing and shouts louder: more insulin, to get the same job done.
        </p>
        <p style={P}>
          That works for a long time. Your blood sugar stays normal because the extra insulin is quietly covering for it. This is why a standard panel can read <em>fine</em> for years while you feel anything but, and why "nothing to worry about yet" is the most expensive sentence in metabolic health.
        </p>
        <p style={{ ...P, marginBottom: 44 }}>
          Here is the part nobody tells you. Insulin is a storage signal. While it is elevated, your body is being told to store fat and not to release it. So you cut calories, and you get the hunger, the fatigue and the crashes, but not the fat loss. The effort was real. The environment it was working against was rigged.
        </p>

        {/* ── primary action: watch ── */}
        <div style={{ background: `linear-gradient(160deg, ${T.forest} 0%, ${T.forest700} 100%)`, borderRadius: 20, padding: 'clamp(32px,5vw,52px)', textAlign: 'center', color: '#fff', boxShadow: T.shadow }}>
          <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.vital, display: 'block', marginBottom: 14 }}>Watch this next</span>
          <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(26px,3.8vw,40px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 16px' }}>
            Now here's how you reverse it.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,.88)', maxWidth: 560, margin: '0 auto 28px' }}>
            Knowing the name of the problem changes nothing on its own. This walkthrough is the sequence: how to fix insulin sensitivity first, in what order, so fat loss stops being the fight and starts being the byproduct.
          </p>

          {playing ? (
            <iframe
              style={frame}
              /* nocookie host so nothing is set before the visitor asks for it */
              src={`https://www.youtube-nocookie.com/embed/${PLAN_VIDEO_ID}?autoplay=1&rel=0`}
              title="How to reverse insulin resistance"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} aria-label="Play the walkthrough" style={{ ...frame, padding: 0, cursor: 'pointer' }}>
              <img
                src={`https://img.youtube.com/vi/${PLAN_VIDEO_ID}/maxresdefault.jpg`}
                onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${PLAN_VIDEO_ID}/hqdefault.jpg` }}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <span style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.2)' }} />
              <svg viewBox="0 0 68 48" width="82" height="58" aria-hidden="true"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.45))' }}>
                <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#FF0000" />
                <path d="M45,24 27,14 27,34 Z" fill="#fff" />
              </svg>
            </button>
          )}

          {/* Secondary only. The watch is the job of this page. */}
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'rgba(255,255,255,.72)', maxWidth: 520, margin: '28px auto 0' }}>
            Want to know which stage you're at first?{' '}
            <Link to={QUIZ_URL} style={{ color: T.vital, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Take the 2 minute assessment
            </Link>.
          </p>
        </div>

        <p style={{ marginTop: 36, fontSize: 13.5, lineHeight: 1.6, color: T.inkFaint, fontStyle: 'italic' }}>
          Educational only, based on lived experience and current research. This is not medical advice and nothing here diagnoses or treats a condition. Insulin resistance is diagnosed by your physician with bloodwork. Always work with a qualified healthcare provider on your own situation, and never start, stop or change a medication based on anything you read here.
        </p>
      </main>

      {/* footer */}
      <footer style={{ background: T.ink, color: '#fff', paddingBlock: 40, marginTop: 64 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.display, fontWeight: 800, fontSize: 18 }}>
            Chainmover Coaching
          </div>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>Luke Strassner, Head Coach</span>
        </div>
      </footer>
    </div>
  )
}
