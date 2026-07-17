import { Stack } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'
import coachPhoto from './assets/coachesphoto.png'
import danielBefore from './assets/Danielbefore2479.PNG'
import danielAfter from './assets/danielafter.jpg'

/* ─── CALENDLY URL — swap this for your real link ─────────────────── */
const CALENDLY_URL = 'https://calendly.com/luke-strassner-fit/1-1-mentorship-session'

const YOUTUBE_URL = 'https://www.youtube.com/@Luke-Strassner'

/* ─── VSL — paste your Loom share ID here ──────────────────────────
   From https://www.loom.com/share/abc123  →  the ID is 'abc123'.    */
const VSL_LOOM_ID = '6833df367eae4444b6225ea68b8612ba'

/* Strips the Loom chrome (top bar, title, owner, share, view count). */
const LOOM_PARAMS = 'hideEmbedTopBar=true&hide_owner=true&hide_title=true&hide_share=true'

/* ─── Google Fonts injected once ──────────────────────────────────── */
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

/* ─── Tokens ───────────────────────────────────────────────────────── */
const T = {
  forest:     '#143D2B',
  forest700:  '#1A4B35',
  forest600:  '#246048',
  moss:       '#3A7D5C',
  vital:      '#46C98B',
  vitalSoft:  '#C9EBD8',
  ink:        '#11241B',
  inkSoft:    '#46554D',
  inkFaint:   '#748178',
  paper:      '#FFFFFF',
  bone:       '#F3F7F3',
  mist:       '#E8F1EA',
  line:       '#DBE5DC',
  lineSoft:   '#EAF0EA',
  display:    '"Archivo","Helvetica Neue",Arial,sans-serif',
  body:       '"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',
  mono:       '"IBM Plex Mono",ui-monospace,"SFMono-Regular",monospace',
  shadow:     '0 10px 30px rgba(17,36,27,.08),0 2px 8px rgba(17,36,27,.05)',
  shadowLg:   '0 30px 70px rgba(17,36,27,.16),0 8px 24px rgba(17,36,27,.08)',
  shadowSm:   '0 1px 2px rgba(17,36,27,.06),0 2px 8px rgba(17,36,27,.04)',
}

/* ─── Global style tag ─────────────────────────────────────────────── */
const GLOBAL_CSS = `
  html { scroll-padding-top: 80px; }
  .cm-landing * { box-sizing: border-box; }
  .cm-landing { font-family: ${T.body}; color: ${T.ink}; background: ${T.paper}; font-size: 18px; line-height: 1.6; letter-spacing: -0.005em; }
  .cm-landing h1,.cm-landing h2,.cm-landing h3,.cm-landing h4 { font-family: ${T.display}; font-weight: 700; line-height: 1.04; letter-spacing: -0.025em; margin: 0; color: ${T.ink}; }
  .cm-landing p { margin: 0; }
  .cm-landing a { color: inherit; text-decoration: none; }
  .cm-landing img { max-width: 100%; display: block; }

  /* nav */
  .cm-nav a { font-size: 15px; font-weight: 500; color: ${T.inkSoft}; transition: color .15s; }
  .cm-nav a:hover { color: ${T.forest}; }

  /* buttons */
  .cm-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    font-family: ${T.body}; font-weight: 600; font-size: 16px;
    padding: 16px 26px; border-radius: 100px; border: 1.5px solid transparent;
    cursor: pointer; transition: transform .18s ease, background .2s ease, box-shadow .2s ease, color .2s ease;
    white-space: nowrap; letter-spacing: -0.01em; text-decoration: none; }
  .cm-btn:active { transform: translateY(1px); }
  .cm-btn-primary { background: ${T.forest}; color: #fff; box-shadow: 0 8px 22px rgba(20,61,43,.28); }
  .cm-btn-primary:hover { background: ${T.forest700}; transform: translateY(-2px); box-shadow: 0 14px 30px rgba(20,61,43,.34); }
  .cm-btn-vital { background: ${T.vital}; color: ${T.forest}; box-shadow: 0 8px 22px rgba(70,201,139,.3); }
  .cm-btn-vital:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(70,201,139,.4); }
  .cm-btn-ghost { background: transparent; color: ${T.ink}; border-color: ${T.line}; }
  .cm-btn-ghost:hover { border-color: ${T.forest}; color: ${T.forest}; }
  .cm-btn-ghost-dark { background: transparent; color: #fff; border-color: rgba(255,255,255,.32); }
  .cm-btn-ghost-dark:hover { border-color: #fff; background: rgba(255,255,255,.08); }
  .cm-btn-lg { padding: 19px 34px; font-size: 17.5px; }
  .cm-btn .arrow { transition: transform .2s ease; display: inline-block; }
  .cm-btn:hover .arrow { transform: translateX(3px); }

  /* eyebrow */
  .cm-eyebrow { font-family: ${T.mono}; font-size: 12.5px; font-weight: 500; letter-spacing: 0.16em;
    text-transform: uppercase; color: ${T.moss}; display: inline-flex; align-items: center; gap: 10px; }
  .cm-eyebrow::before { content: ""; width: 22px; height: 1.5px; background: ${T.moss}; display: inline-block; }
  .cm-eyebrow-vital { color: ${T.vital}; }
  .cm-eyebrow-vital::before { background: ${T.vital}; }
  .cm-eyebrow-center { justify-content: center; }

  /* scorecard bar animation */
  .sc-bar-inner { display: block; height: 100%; border-radius: 100px;
    background: linear-gradient(90deg, ${T.moss}, ${T.vital}); }

  /* pillar hover bar */
  .cm-pillar { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px;
    padding: 30px 26px 32px; position: relative; transition: transform .25s ease, box-shadow .25s ease, border-color .25s; overflow: hidden; }
  .cm-pillar:hover { transform: translateY(-4px); box-shadow: ${T.shadow}; border-color: ${T.vitalSoft}; }
  .cm-pillar .pillar-bar { position: absolute; left: 0; top: 0; height: 4px; width: 100%;
    background: linear-gradient(90deg, ${T.moss}, ${T.vital}); transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
  .cm-pillar:hover .pillar-bar { transform: scaleX(1); }
  .cm-pillar .pillar-letter { font-family: ${T.display}; font-weight: 800; font-size: 56px; line-height: 1;
    color: ${T.vitalSoft}; letter-spacing: -0.04em; margin: 6px 0 18px; transition: color .25s; }
  .cm-pillar:hover .pillar-letter { color: ${T.vital}; }

  /* faq */
  .cm-faq-item summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between;
    align-items: center; padding: 22px 0; font-family: ${T.display}; font-weight: 600; font-size: 17px;
    color: ${T.ink}; border-top: 1px solid ${T.line}; user-select: none; }
  .cm-faq-item summary::-webkit-details-marker { display: none; }
  .cm-faq-item summary .q-ico::after { content: "+"; font-size: 22px; font-weight: 400; color: ${T.moss}; transition: transform .25s; display: inline-block; }
  .cm-faq-item[open] summary .q-ico::after { transform: rotate(45deg); }
  .cm-faq-item .faq-a { padding: 0 0 22px; font-size: 16px; color: ${T.inkSoft}; line-height: 1.65; }

  /* cal slot */
  .cm-cal-slot { padding: 10px 14px; border: 1px solid ${T.line}; border-radius: 10px;
    font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all .15s; color: ${T.ink}; }
  .cm-cal-slot:hover { border-color: ${T.forest}; color: ${T.forest}; }
  .cm-cal-slot.sel { background: ${T.forest}; color: #fff; border-color: ${T.forest}; }

  /* footer link */
  .cm-footer-link { color: rgba(255,255,255,.6); font-size: 15px; transition: color .15s; display: block; }
  .cm-footer-link:hover { color: #fff; }

  @media (max-width: 940px) { .cm-nav { display: none !important; } }
  @media (max-width: 560px) { .cm-header-call { display: none !important; } }
  @media (max-width: 880px) { .cm-hero-grid { grid-template-columns: 1fr !important; } }
  @media (max-width: 720px) { .cm-stats-grid { grid-template-columns: repeat(2,1fr) !important; } }
  @media (max-width: 900px) { .cm-method-grid { grid-template-columns: repeat(2,1fr) !important; } .cm-results-grid { grid-template-columns: 1fr !important; max-width: 460px; margin-inline: auto; } .cm-about-grid { grid-template-columns: 1fr !important; } }
  @media (max-width: 820px) { .cm-convert-grid { grid-template-columns: 1fr !important; } }
  @media (max-width: 720px) { .cm-guarantee-grid { grid-template-columns: 1fr !important; } }
  @media (max-width: 520px) { .cm-method-grid { grid-template-columns: 1fr !important; } .sc-float { display: none !important; } }
  @media (max-width: 480px) { .cm-sc-float { display: none !important; } }
  @media (max-width: 820px) { .cm-feature-grid { grid-template-columns: 1fr !important; } }
  @media (max-width: 760px) { .cm-vids-grid { grid-template-columns: 1fr !important; max-width: 340px !important; } .cm-quotes-grid { grid-template-columns: 1fr !important; } }
`

function StyleTag() {
  return <style>{GLOBAL_CSS}</style>
}

/* ─── Wrap helper ──────────────────────────────────────────────────── */
function Wrap({ children, style }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingInline: 'clamp(20px,5vw,64px)', ...style }}>
      {children}
    </div>
  )
}

/* ─── Header ───────────────────────────────────────────────────────── */
function Header() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,.82)',
      backdropFilter: 'saturate(180%) blur(14px)',
      borderBottom: `1px solid ${T.lineSoft}`,
    }}>
      <Wrap>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76, gap: 24 }}>
          {/* Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: T.display, fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em', color: T.ink, textDecoration: 'none' }}>
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 48, width: 'auto', objectFit: 'contain', display: 'block' }} />
            <span>Chainmover<small style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.18em', color: T.inkFaint, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginTop: 2 }}>Fitness · MROI Method</small></span>
          </Link>

          {/* Nav */}
          <nav className="cm-nav" style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
            <a href="#method">The Method</a>
            <a href="#results">Results</a>
            <a href="#about">Coach</a>
            <a href="#guarantee">Guarantee</a>
            <a href="#faq">FAQ</a>
          </nav>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link to="/quiz" className="cm-btn cm-btn-ghost cm-header-call" style={{ padding: '12px 22px', fontSize: 15 }}>
              Take the Assessment
            </Link>
            <Link to="/apply"
              className="cm-btn cm-btn-primary"
              style={{ padding: '12px 22px', fontSize: 15, color: 'white' }}>Apply now</Link>
          </div>
        </div>
      </Wrap>
    </header>
  )
}

/* ─── Scorecard (hero visual) ─────────────────────────────────────── */
function Scorecard() {
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.line}`, borderRadius: 22,
      boxShadow: T.shadowLg, padding: 26, position: 'relative',
    }}>
      {/* gradient border top */}
      <div style={{ position: 'absolute', inset: -1, borderRadius: 23, pointerEvents: 'none',
        background: 'linear-gradient(160deg,rgba(70,201,139,.5),rgba(70,201,139,0) 40%)',
        WebkitMask: 'linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0)',
        WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: 1 }} />

      {/* head */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 18, borderBottom: `1px solid ${T.lineSoft}` }}>
        <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: T.inkFaint }}>Metabolic Health Assessment</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: T.mono, fontSize: 11, color: T.moss, letterSpacing: '.08em' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.vital, boxShadow: `0 0 0 4px rgba(70,201,139,.18)` }} />
          RESULT
        </span>
      </div>

      {/* score */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '22px 0 18px' }}>
        <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 64, lineHeight: 1, letterSpacing: '-0.04em', color: T.forest }}>38</span>
        <span style={{ fontFamily: T.mono, fontSize: 14, color: T.inkFaint }}>/ 100 health score</span>
        <span style={{ marginLeft: 'auto', alignSelf: 'center', fontFamily: T.body, fontWeight: 600, fontSize: 13, color: '#B4530F', background: '#FCEDDD', padding: '6px 12px', borderRadius: 100 }}>High-risk zone</span>
      </div>

      {/* bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '8px 0 20px' }}>
        {[['Metabolic', 28], ['Recovery', 41], ['Optimize', 33], ['Identity', 52]].map(([name, pct]) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: '96px 1fr auto', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{name}</span>
            <div style={{ height: 7, borderRadius: 100, background: T.mist, overflow: 'hidden' }}>
              <span className="sc-bar-inner" style={{ width: `${pct}%` }} />
            </div>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.inkSoft }}>{pct}%</span>
          </div>
        ))}
      </div>

      {/* foot */}
      <div style={{ background: T.bone, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: T.forest, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: T.mono, fontWeight: 600, flexShrink: 0 }}>{">"}</div>
        <div>
          <b style={{ display: 'block', fontFamily: T.display, fontSize: 15 }}>Recommended path: MROI Reset</b>
          <span style={{ fontSize: 13, color: T.inkSoft }}>Start with Metabolic — fix the root, then build.</span>
        </div>
      </div>

      
    </div>
  )
}

/* ─── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: `radial-gradient(120% 120% at 85% -10%,${T.mist} 0%,rgba(232,241,234,0) 55%),${T.paper}`,
    }}>
      <Wrap>
        <div className="cm-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(36px,5vw,80px)', alignItems: 'center', paddingBlock: 'clamp(56px,7vw,104px)' }}>

          {/* Copy */}
          <div>
            <span className="cm-eyebrow" style={{ marginBottom: 20, display: 'inline-flex' }}>For men carrying 50+ lbs they're ready to lose</span>
            <h1 style={{ fontSize: 'clamp(38px,4.6vw,60px)', fontWeight: 800, lineHeight: 1.04 }}>
              Stop guessing. <em style={{ fontStyle: 'normal', color: T.forest }}>Get the data</em>, then lose the weight for good.
            </h1>
            <p className="lede" style={{ marginTop: 24, maxWidth: 480, fontSize: 'clamp(17px,1.5vw,20px)', color: T.inkSoft, lineHeight: 1.6 }}>
              You've tried before. Bad labs, low energy, no real plan. The free assessment shows you exactly where your health stands — then routes you to the path built to fix it.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 34, alignItems: 'center' }}>
              <Link to="/apply" className="cm-btn cm-btn-primary cm-btn-lg" style={{color: 'white'}}>Apply to work with Luke <span className="arrow">→</span></Link>
              <Link to="/quiz" className="cm-btn cm-btn-ghost cm-btn-lg">Take the Free Assessment</Link>
            </div>
            <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ color: T.vital, letterSpacing: 2, fontSize: 15 }}>★★★★★</span>
              <span style={{ fontSize: 14.5, color: T.inkSoft }}>
                <strong style={{ color: T.ink }}>Built for the man who's serious this time.</strong> 
              </span>
            </div>
            <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['50+ lbs to lose', 'Pre-diabetic / bad labs', 'Tried & failed before', 'Wants 1-on-1 accountability'].map(chip => (
                <span key={chip} style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.02em', color: T.forest600, background: T.mist, border: `1px solid ${T.line}`, padding: '7px 13px', borderRadius: 100 }}>{chip}</span>
              ))}
            </div>
          </div>

          {/* Scorecard visual */}
          <div style={{ position: 'relative' }}>
            <Scorecard />
          </div>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── VSL (Loom embed) ─────────────────────────────────────────────── */
function VSL() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(56px,7vw,96px)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', paddingInline: 'clamp(20px,5vw,64px)' }}>
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto' }}>
          <span className="cm-eyebrow cm-eyebrow-center">Watch this first</span>
          <h2 style={{ fontSize: 'clamp(28px,3.8vw,46px)', marginTop: 16 }}>
            How we get men 50+ lbs down — for good
          </h2>
          <p style={{ marginTop: 16, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft, lineHeight: 1.6 }}>
            A few minutes on exactly how the MROI Method works and whether it's the right fit for you. Watch before you book.
          </p>
        </div>

        <div style={{ marginTop: 36, position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 18, overflow: 'hidden', boxShadow: T.shadowLg, border: `1px solid ${T.line}`, background: '#000' }}>
          {VSL_LOOM_ID === 'PASTE_VSL_LOOM_ID_HERE' ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: T.inkFaint, fontFamily: T.mono, fontSize: 13, textAlign: 'center', padding: 24, background: T.mist }}>
              <span style={{ fontSize: 15, color: T.inkSoft, fontWeight: 600 }}>Loom VSL placeholder</span>
              <span>Paste your Loom share ID into VSL_LOOM_ID at the top of LandingPage.jsx</span>
            </div>
          ) : (
            <iframe
              src={`https://www.loom.com/embed/${VSL_LOOM_ID}?${LOOM_PARAMS}`}
              title="Chainmover Fitness — VSL"
              frameBorder="0"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/apply" className="cm-btn cm-btn-primary cm-btn-lg" style={{ color: 'white' }}>
            Apply to work with Luke <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

// /* ─── Stats bar ────────────────────────────────────────────────────── */
// function StatsBar() {
//   const stats = [
//     { num: '200', sup: '+', label: 'Men coached 1-on-1' },
//     { num: '52', sup: ' lbs', label: 'Avg loss per program' },
//     { num: '9', sup: '/10', label: 'Improved their labs' },
//     { num: '100', sup: '%', label: 'Guarantee-backed' },
//   ]
//   return (
//     <section style={{ background: T.forest, color: '#fff' }}>
//       <Wrap>
//         <div className="cm-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, paddingBlock: 54 }}>
//           {stats.map((s, i) => (
//             <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
//               {i > 0 && <div style={{ position: 'absolute', left: -16, top: 6, bottom: 6, width: 1, background: 'rgba(255,255,255,.14)' }} />}
//               <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(34px,4vw,50px)', letterSpacing: '-0.03em' }}>
//                 {s.num}<em style={{ fontStyle: 'normal', color: T.vital }}>{s.sup}</em>
//               </div>
//               <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.08em', color: 'rgba(255,255,255,.66)', textTransform: 'uppercase', marginTop: 8 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </Wrap>
//     </section>
//   )
// }

/* ─── MROI Method ──────────────────────────────────────────────────── */
const PILLARS = [
  { step: 'STEP 01', letter: 'M', title: 'Metabolic', body: 'Fix the metabolic issues and metabolic syndrome first. We attack the biggest problems with your health before anything else.' },
  { step: 'STEP 02', letter: 'R', title: 'Recovery', body: 'Repair sleep, aching joints and stress load. Strong recovery is what keeps fat loss running smooth instead of stalling.' },
  { step: 'STEP 03', letter: 'O', title: 'Optimize', body: 'Layer in advanced fat-loss tools so you never plateau. Results stay predictable and consistent, week after week.' },
  { step: 'STEP 04', letter: 'I', title: 'Identity', body: "This is where results become permanent. We rewire your identity so health is part of who you are — not a diet you're white-knuckling." },
]

function Method() {
  return (
    <section id="method" style={{ background: T.bone, paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 640, marginInline: 'auto', textAlign: 'center', marginBottom: 56 }}>
          <span className="cm-eyebrow cm-eyebrow-center">The Mechanism · M.R.O.I.</span>
          <h2 style={{ fontSize: 'clamp(32px,4.4vw,54px)', marginTop: 18 }}>A sequence, not a crash diet.</h2>
          <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.5vw,20px)', color: T.inkSoft, lineHeight: 1.6 }}>
            Most programs throw you straight into extreme restriction with no regard for where your metabolic health is at. The MROI Method (Metabolic, Recovery, Optimize, Identity) fixes the root first, so fat loss actually holds, and stays gone.
          </p>
        </div>
        <div className="cm-method-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {PILLARS.map(p => (
            <article key={p.letter} className="cm-pillar">
              <div className="pillar-bar" />
              <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkFaint, letterSpacing: '.1em' }}>{p.step}</div>
              <div className="pillar-letter">{p.letter}</div>
              <h3 style={{ fontSize: 22 }}>{p.title}</h3>
              <p style={{ marginTop: 12, fontSize: 15, color: T.inkSoft, lineHeight: 1.55 }}>{p.body}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── Results / Testimonials ───────────────────────────────────────── */
const QUOTES = [
  { name: 'Daniel', stat: 'Down 85 lbs', quote: "Two months in, people are noticing. I get compliments from family, coworkers, friends. I really can't recall the last time I felt this confident. It's amazing." },
  { name: 'Larry', stat: 'Down 40 lbs in 5 months', quote: "Other coaches felt like I was being handed off to a guy in Ecuador. It didn't feel the same. With Luke I actually get Luke. If I don't have enough communication, it doesn't work for me, and this works." },
  { name: 'Sascha', stat: 'Entrepreneur, Father', quote: "In my business it's man to man. What I look like on the outside is what people presume about how my business is run. This is the first time in years the scale is actually going the right way. I broke 230 for the first time in years, in the first couple of weeks. Nutrition wise I'm dialed in and the weight is moving." },
  { name: 'Wyatt', stat: 'Doctor of Chiropractic Medicine', quote: "You're not just doing a little bit of exercise and a little bit of nutrition. You're getting down to the minutiae of it. That's what actually makes me think you know what you're doing." },
  { name: 'Gabe', stat: 'Down 25 lbs in 3 months', quote: "The biggest difference in the program is probably my mental health. My clothes fit better, I have better energy. Not only do I have more confidence, but I finally feel like 'yeah, I can do this.' It's not just a pipe dream anymore." },
]

/* Loom video testimonial share IDs (vertical clips). */
const VIDEO_TESTIMONIALS = [
  '700a1f79caeb4f7fa712c03e8686aeeb',
  'a316d667a37a47459297c37290742260',
  '18919208d0a14a59beb50f448ffca7f1',
]

function Results() {
  return (
    <section id="results" style={{ paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 640 }}>
          <span className="cm-eyebrow">Client Wins</span>
          <h2 style={{ fontSize: 'clamp(32px,4.4vw,54px)', marginTop: 18 }}>Real men. Real pounds gone for good.</h2>
          <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.5vw,20px)', color: T.inkSoft, lineHeight: 1.6 }}>
            The words, straight from the men who did it.
          </p>
        </div>

        {/* Featured before/after — Daniel */}
        {/* <div className="cm-feature-grid" style={{ marginTop: 56, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 20, overflow: 'hidden', boxShadow: T.shadow, display: 'grid', gridTemplateColumns: '1.1fr .9fr' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: T.line, position: 'relative' }}>
            <img src={danielBefore} alt="Daniel before" style={{ width: '100%', height: '100%', minHeight: 340, objectFit: 'cover', display: 'block' }} />
            <img src={danielAfter} alt="Daniel after" style={{ width: '100%', height: '100%', minHeight: 340, objectFit: 'cover', display: 'block' }} />
            <span style={{ position: 'absolute', top: 14, left: 14, fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: 'rgba(17,36,27,.72)', color: '#fff', padding: '4px 9px', borderRadius: 100 }}>Before</span>
            <span style={{ position: 'absolute', top: 14, right: 14, fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: T.vital, color: T.forest, padding: '4px 9px', borderRadius: 100 }}>After</span>
          </div>
          <div style={{ padding: 'clamp(28px,4vw,44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="cm-eyebrow">The transformation</span>
            <b style={{ fontFamily: T.display, fontSize: 28, marginTop: 14 }}>Daniel</b>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 16 }}>
              <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 52, color: T.forest, letterSpacing: '-0.03em' }}>−85</span>
              <span style={{ fontFamily: T.mono, fontSize: 14, color: T.inkFaint }}>lbs lost</span>
            </div>
            <p style={{ marginTop: 18, fontSize: 16, color: T.inkSoft, lineHeight: 1.6 }}>
              Markers normalized, energy and confidence back. His words are below.
            </p>
          </div>
        </div> */}

        {/* Written quotes — Daniel + Gabe */}
        <div className="cm-quotes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
          {QUOTES.map(q => (
            <blockquote key={q.name} style={{ margin: 0, background: T.bone, border: `1px solid ${T.line}`, borderRadius: 18, padding: 'clamp(26px,3.5vw,38px)', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(19px,2.2vw,24px)', lineHeight: 1.45, color: T.ink, letterSpacing: '-0.01em' }}>“{q.quote}”</p>
              <footer style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <b style={{ fontFamily: T.display, fontSize: 17, color: T.ink }}>{q.name}</b>
                <span style={{ fontFamily: T.mono, fontSize: 13, color: T.moss }}>{q.stat}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── Video testimonials (Loom) ────────────────────────────────────── */
function VideoTestimonials() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 640, textAlign: 'center', marginInline: 'auto' }}>
          <span className="cm-eyebrow cm-eyebrow-center">In their own words</span>
          <h2 style={{ fontSize: 'clamp(32px,4.4vw,54px)', marginTop: 18 }}>Hear it straight from them</h2>
          <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.5vw,20px)', color: T.inkSoft, lineHeight: 1.6 }}>
            Short, unscripted clips from men who sat exactly where you are now.
          </p>
        </div>
        <div className="cm-vids-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 48, maxWidth: 760, marginInline: 'auto' }}>
          {VIDEO_TESTIMONIALS.map((id, i) => (
            <div key={id} style={{ background: '#000', border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden', boxShadow: T.shadow, aspectRatio: '9 / 16' }}>
              <iframe
                src={`https://www.loom.com/embed/${id}?${LOOM_PARAMS}`}
                title={`Client testimonial ${i + 1}`}
                frameBorder="0"
                allowFullScreen
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── About ────────────────────────────────────────────────────────── */
const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 15, height: 15, color: T.vital }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function About() {
  return (
    <section id="about" style={{ background: T.mist, paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div className="cm-about-grid" style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 'clamp(36px,5vw,72px)', alignItems: 'center' }}>
          {/* Coach photo */}
          <div style={{ position: 'relative' }}>
            <img src={coachPhoto} alt="Coach Luke Strassner" style={{ width: '100%', height: 520, objectFit: 'cover', borderRadius: 18, boxShadow: T.shadow, display: 'block' }} />
            <div style={{ position: 'absolute', right: -14, bottom: 28, background: T.paper, borderRadius: 14, boxShadow: T.shadow, padding: '16px 20px' }}>
              <b style={{ fontFamily: T.display, fontWeight: 800, fontSize: 28, color: T.forest, display: 'block', letterSpacing: '-0.02em' }}>100+ lbs</b>
              <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.06em', color: T.inkFaint, textTransform: 'uppercase' }}>Lost Personally</span>
            </div>
          </div>

          {/* Body */}
          <div>
            <span className="cm-eyebrow">Meet your coach</span>
            <h2 style={{ fontSize: 'clamp(30px,4vw,48px)', marginTop: 18 }}>I coach the man who is ready to turn his health around.</h2>
            <p style={{ marginTop: 20, color: T.inkSoft }}>
              I built the MROI Method after watching too many men waste time and money on generic approaches, then blame themselves when it failed.
            </p>
            <p style={{ marginTop: 20, color: T.inkSoft }}>
              Every client I take on gets high-touch, 1-on-1 coaching: direct access, lab-informed programming, and a plan that addresses your specific problems. I help men that are done starting over.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 26 }}>
              {['Lab-informed programming', '1-on-1 only', 'Specializes in 50+ lb loss'].map(c => (
                <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 100, padding: '9px 15px', fontSize: 13.5, fontWeight: 600, color: T.forest }}>
                  {CHECK}{c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── Guarantee ────────────────────────────────────────────────────── */
function Guarantee() {
  return (
    <section id="guarantee" style={{ background: T.forest, color: '#fff', position: 'relative', overflow: 'hidden', paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <div style={{ position: 'absolute', right: -120, top: -120, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(70,201,139,.22),transparent 68%)', pointerEvents: 'none' }} />
      <Wrap>
        <div className="cm-guarantee-grid" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(32px,5vw,64px)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Seal */}
          <div style={{ width: 184, height: 184, borderRadius: '50%', border: '2px solid rgba(70,201,139,.4)', display: 'grid', placeItems: 'center', textAlign: 'center', flexShrink: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 14, borderRadius: '50%', border: '1px dashed rgba(255,255,255,.22)' }} />
            <div>
              <b style={{ fontFamily: T.display, fontWeight: 800, fontSize: 46, color: T.vital, lineHeight: .9, letterSpacing: '-0.03em', display: 'block' }}>50</b>
              <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', marginTop: 6, display: 'block' }}>lbs or free</span>
            </div>
          </div>
          {/* Copy */}
          <div>
            <span className="cm-eyebrow cm-eyebrow-vital">The risk is mine</span>
            <h2 style={{ color: '#fff', fontSize: 'clamp(28px,3.8vw,46px)', marginTop: 16 }}>Lose 50 lbs by the end of your program — or I work for free until you do.</h2>
            <p style={{ marginTop: 18, color: 'rgba(255,255,255,.78)', maxWidth: 620, fontSize: 18 }}>
              That's the whole deal. You show up and do the work; I carry the risk. If you finish the program and you haven't lost 50 pounds, I keep coaching you 1-on-1 at no cost until you get there. Fine print: 80% compliance required.
            </p>
            <div style={{ marginTop: 30 }}>
              <Link to="/apply" className="cm-btn cm-btn-vital cm-btn-lg">Apply to Work With Luke<span className="arrow">→</span></Link>
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── Convert (Assessment + Call) ─────────────────────────────────── */
function Convert() {
  const [selectedSlot, setSelectedSlot] = useState('Tue 2:30')
  const slots = ['Tue 9:00', 'Tue 2:30', 'Wed 11:00', 'Thu 8:00', 'Thu 4:30', 'Fri 1:00']

  return (
    <section id="assessment" style={{ paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 640, marginInline: 'auto', textAlign: 'center', marginBottom: 48 }}>
          <span className="cm-eyebrow cm-eyebrow-center">Two ways to start</span>
          <h2 style={{ fontSize: 'clamp(32px,4.4vw,54px)', marginTop: 18 }}>Start with the assessment.</h2>
          <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.5vw,20px)', color: T.inkSoft, lineHeight: 1.6 }}>
            Three minutes tells us where you stand and which path fits. Ready to move now? Apply to work with me directly.
          </p>
        </div>
        <div className="cm-convert-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28 }}>
          {/* Assessment card */}
          <div style={{ background: T.forest, color: '#fff', borderRadius: 22, padding: 'clamp(32px,4vw,48px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -80, bottom: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(70,201,139,.16),transparent 70%)', pointerEvents: 'none' }} />
            <span className="cm-eyebrow cm-eyebrow-vital"></span>
            <h3 style={{ color: '#fff', fontSize: 'clamp(26px,3vw,38px)', marginTop: 16 }}>Take the Metabolic Health Assessment</h3>
            <p style={{ color: 'rgba(255,255,255,.78)', marginTop: 16 }}>
              Answer a few honest questions about your weight, energy, sleep and labs. You'll get a health score and the exact MROI path to start on.
            </p>
            <div style={{ display: 'flex', gap: 18, marginTop: 30 }}>
              {[['01', 'Answer', '~3 min, no card'], ['02', 'Get your score', 'See your weak link'], ['03', 'Get your path', 'Routed to MROI']].map(([n, b, s]) => (
                <div key={n} style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.mono, fontSize: 11, color: T.vital, letterSpacing: '.1em' }}>{n}</div>
                  <b style={{ display: 'block', fontFamily: T.display, fontSize: 15, marginTop: 6, color: '#fff' }}>{b}</b>
                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)' }}>{s}</span>
                </div>
              ))}
            </div>
            <Link to="/quiz" className="cm-btn cm-btn-vital cm-btn-lg" style={{ marginTop: 28 }}>Start the assessment <span className="arrow">→</span></Link>
          </div>

          {/* Call card */}
          <Stack id="call" style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 22, padding: 'clamp(32px,4vw,48px)' }} sx={{ justifyContent: 'space-between' }}>
            <div><span className="cm-eyebrow">Or apply directly</span>
            <h3 style={{ fontSize: 'clamp(24px,2.6vw,32px)', marginTop: 16 }}>Talk to me 1-on-1</h3>
            <p style={{ color: T.inkSoft, marginTop: 14 }}>Answer a few quick questions, then book a discovery call. We'll look at your situation and come up with a gameplan together. If it's not the right fit, I'll still point you in the right direction.</p>
            </div>
            <Link to="/apply" className="cm-btn cm-btn-primary" style={{ marginTop: 20, width: '100%', color: 'white'}}>Apply to work with Luke <span className="arrow">→</span></Link>
          </Stack>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── FAQ ──────────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'How does the 50 lbs guarantee actually work?', a: "When you complete your program, with a minimum of 80% compliance, and haven't lost 50 pounds, I keep working with you 1-on-1 at no additional cost until you do. The risk sits with me, not you." },
  { q: "I've failed at this before. Why would this be different?", a: "Because we take a completely unique approach. The MROI method starts with your metabolic issues first, and the high-touch accountability/support from Luke ensures compliance. Most past failures are a structure/system problem, and a lack of support when you need it most." },
  { q: 'What if my labs are already bad?', a: "That's exactly who this is built for. Pre-diabetic, high blood pressure, poor sleep, low energy...those are the metabolic problems we attack first. The assessment helps flag where you stand. (This isn't medical advice; we coordinate with, not replace, your doctor.)" },
  { q: 'Is the assessment really free?', a: "Yes. No credit card, no obligation. It takes about three minutes and gives you a health score plus the right MROI path to begin on." },
  { q: 'How much time does the coaching take each week?', a: "It's built around a busy man's life. Expect a few focused training sessions and simple daily habits...not living in the gym. The 1-on-1 structure means the plan flexes to your schedule, not the other way around. Specifically, a client of mine -Karter- lost 20 lbs in the first 10 weeks while working 60-70 hours per week." },
  { q: 'Do you only work with men who have 50+ lbs to lose?', a: "That's my specialty and where the guarantee applies. If you're close but not sure you fit, apply and we'll figure it out honestly. Full transparency: the bulk of my clientele are men, but I don't turn away women who believe this is the right fit." },
    { q: "How much does the coaching cost?", a: "We'll talk specifics on the call once I understand your situation, because the right structure depends on where you're starting. What I can tell you now: it's high-touch 1-on-1 coaching directly with me, backed by the guarantee that you lose 50 lbs or I work for free until you do. The risk sits with me. That being said, my pricing is quite standard for the industry." },

]

function FAQ() {
  return (
    <section id="faq" style={{ paddingBlock: 'clamp(72px,9vw,140px)', background: T.bone }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(36px,5vw,80px)', alignItems: 'start' }}>
          <div>
            <span className="cm-eyebrow">FAQ</span>
            <h2 style={{ fontSize: 'clamp(30px,4vw,46px)', marginTop: 18 }}>Straight answers.</h2>
            <div style={{ marginTop: 32, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: '28px 28px 32px' }}>
              <h3 style={{ fontSize: 19, }}>Still not sure?</h3>
              <p style={{ marginTop: 12, color: T.inkSoft, fontSize: 15 }}>The assessment is free and takes about three minutes. Worst case, you learn exactly where your health stands.</p>
              <Link to="/quiz" className="cm-btn cm-btn-primary" style={{ marginTop: 20, color: 'white' }}>Take the Assessment</Link>
            </div>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <details key={i} className="cm-faq-item" open={i === 0}>
                <summary>{f.q}<span className="q-ico" /></summary>
                <div className="faq-a">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── Footer ───────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: T.ink, color: '#fff', paddingBlock: 'clamp(48px,6vw,80px)' }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'clamp(32px,4vw,56px)', paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: T.display, fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>
              <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 40, width: 'auto', objectFit: 'contain', display: 'block' }} />
              <span>Chainmover Fitness</span>
            </div>
            <p style={{ marginTop: 16, color: 'rgba(255,255,255,.6)', fontSize: 15, maxWidth: 320, lineHeight: 1.65 }}>
              High-touch 1-on-1 coaching for men ready to lose 50+ pounds for good — using the MROI Method. Backed by a guarantee.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 18 }}>Explore</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['#method', 'The MROI Method'], ['#results', 'Client Results'], ['#about', 'About the Coach'], ['#guarantee', 'The Guarantee'], ['#faq', 'FAQ']].map(([href, label]) => (
                <li key={label}><a href={href} className="cm-footer-link">{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 18 }}>Start</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['/quiz', 'Take the Assessment'], ['/apply', 'Apply to Work With Luke'], ['https://instagram.com/luke.strassner.fit', 'Instagram'], [YOUTUBE_URL, 'YouTube']].map(([href, label]) => (
                <li key={label}>
                  {href.startsWith('/')
                    ? <Link to={href} className="cm-footer-link">{label}</Link>
                    : <a href={href} target="_blank" rel="noreferrer" className="cm-footer-link">{label}</a>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 14 }}>© 2026 Chainmover Fitness. All rights reserved.</span>
          <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 12.5, maxWidth: 700, lineHeight: 1.55 }}>
            Results vary. Coaching is not medical advice and does not replace your physician. The 50 lb guarantee requires full program completion and 80% adherence to coaching.
          </span>
        </div>
      </Wrap>
    </footer>
  )
}

/* ─── Root ─────────────────────────────────────────────────────────── */
export default function LandingPage() {
  useFonts()
  return (
    <div className="cm-landing">
      <StyleTag />
      <Header />
      <main>
        <VSL />
        <Hero />
        {/* <StatsBar /> */}
        <Method />
        <Results />
        <VideoTestimonials />
        <About />
        <Guarantee />
        <Convert />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
