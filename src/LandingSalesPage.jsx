import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'

/* ══════════════════════════════════════════════════════════════════════
   ISOLATED TEST ROUTE — /landing  (VSL & Sales Page, no pricing)
   Fully self-contained. All styles scoped under `.mroi-lp`. Nothing here
   touches or imports the live site's routes, components, or globals.
   ══════════════════════════════════════════════════════════════════════ */

/* ─── VSL — paste your Loom share ID here ──────────────────────────────
   From https://www.loom.com/share/abc123  →  the ID is 'abc123'.        */
const VSL_LOOM_ID = 'PASTE_VSL_LOOM_ID_HERE'
const LOOM_PARAMS = 'hideEmbedTopBar=true&hide_owner=true&hide_title=true&hide_share=true'

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

/* ─── Scoped CSS (everything under `.mroi-lp`, zero global leak) ────── */
const CSS = `
  .mroi-lp * { box-sizing: border-box; }
  .mroi-lp { font-family: ${T.body}; color: ${T.ink}; background: ${T.paper}; font-size: 18px; line-height: 1.6; letter-spacing: -0.005em; }
  .mroi-lp h1,.mroi-lp h2,.mroi-lp h3,.mroi-lp h4 { font-family: ${T.display}; font-weight: 800; line-height: 1.05; letter-spacing: -0.025em; margin: 0; color: ${T.ink}; }
  .mroi-lp p { margin: 0; }
  .mroi-lp a { color: inherit; text-decoration: none; }
  .mroi-lp img { max-width: 100%; display: block; }

  .mroi-lp .eyebrow { font-family: ${T.mono}; font-size: 12.5px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: ${T.moss}; display: inline-flex; align-items: center; gap: 10px; }
  .mroi-lp .eyebrow::before { content: ""; width: 22px; height: 1.5px; background: ${T.moss}; display: inline-block; }
  .mroi-lp .eyebrow.center { justify-content: center; }
  .mroi-lp .eyebrow.vital { color: ${T.vital}; }
  .mroi-lp .eyebrow.vital::before { background: ${T.vital}; }

  .mroi-lp .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: ${T.body}; font-weight: 700; font-size: 16px; padding: 16px 28px; border-radius: 100px; border: 1.5px solid transparent; cursor: pointer; transition: transform .18s ease, background .2s ease, box-shadow .2s ease, color .2s; white-space: nowrap; letter-spacing: -0.01em; }
  .mroi-lp .btn:active { transform: translateY(1px); }
  .mroi-lp .btn-vital { background: ${T.vital}; color: ${T.forest}; box-shadow: 0 8px 22px rgba(70,201,139,.32); }
  .mroi-lp .btn-vital:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(70,201,139,.42); }
  .mroi-lp .btn-primary { background: ${T.forest}; color: #fff; box-shadow: 0 8px 22px rgba(20,61,43,.28); }
  .mroi-lp .btn-primary:hover { background: ${T.forest700}; transform: translateY(-2px); box-shadow: 0 14px 30px rgba(20,61,43,.34); }
  .mroi-lp .btn-lg { padding: 19px 36px; font-size: 17.5px; }
  .mroi-lp .btn .arrow { transition: transform .2s ease; display: inline-block; }
  .mroi-lp .btn:hover .arrow { transform: translateX(3px); }

  .mroi-lp .pillar { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 30px 26px 32px; position: relative; overflow: hidden; transition: transform .25s ease, box-shadow .25s ease, border-color .25s; }
  .mroi-lp .pillar:hover { transform: translateY(-4px); box-shadow: ${T.shadow}; border-color: ${T.vitalSoft}; }
  .mroi-lp .pillar .bar { position: absolute; left: 0; top: 0; height: 4px; width: 100%; background: linear-gradient(90deg, ${T.moss}, ${T.vital}); transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
  .mroi-lp .pillar:hover .bar { transform: scaleX(1); }
  .mroi-lp .pillar .letter { font-family: ${T.display}; font-weight: 800; font-size: 56px; line-height: 1; color: ${T.vitalSoft}; letter-spacing: -0.04em; margin: 6px 0 18px; transition: color .25s; }
  .mroi-lp .pillar:hover .letter { color: ${T.vital}; }

  .mroi-lp .faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; font-family: ${T.display}; font-weight: 700; font-size: 17px; color: ${T.ink}; border-top: 1px solid ${T.line}; user-select: none; }
  .mroi-lp .faq summary::-webkit-details-marker { display: none; }
  .mroi-lp .faq summary .ico::after { content: "+"; font-size: 22px; font-weight: 400; color: ${T.moss}; transition: transform .25s; display: inline-block; }
  .mroi-lp .faq[open] summary .ico::after { transform: rotate(45deg); }
  .mroi-lp .faq .ans { padding: 0 0 22px; font-size: 16px; color: ${T.inkSoft}; line-height: 1.65; }

  .mroi-lp .footer-link { color: rgba(255,255,255,.6); font-size: 15px; transition: color .15s; display: block; }
  .mroi-lp .footer-link:hover { color: #fff; }

  @media (max-width: 900px) { .mroi-lp .hero-grid { grid-template-columns: 1fr !important; } .mroi-lp .phase-grid { grid-template-columns: repeat(2,1fr) !important; } .mroi-lp .proof-grid { grid-template-columns: 1fr 1fr !important; } .mroi-lp .get-grid { grid-template-columns: 1fr !important; } }
  @media (max-width: 760px) { .mroi-lp .compare-grid { grid-template-columns: 1fr !important; } .mroi-lp .faq-grid { grid-template-columns: 1fr !important; } }
  @media (max-width: 560px) { .mroi-lp .phase-grid { grid-template-columns: 1fr !important; } .mroi-lp .proof-grid { grid-template-columns: 1fr !important; } .mroi-lp .nav-links { display: none !important; } }
`

function Wrap({ children, style }) {
  return <div style={{ maxWidth: 1180, margin: '0 auto', paddingInline: 'clamp(20px,5vw,64px)', ...style }}>{children}</div>
}

/* ─── Header ───────────────────────────────────────────────────────── */
function Header() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.82)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
      <Wrap>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76, gap: 24 }}>
          <Link to="/landing" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 46, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em', color: T.ink }}>
              Chainmover
              <small style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.18em', color: T.inkFaint, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginTop: 2 }}>The M.R.O.I. Protocol™</small>
            </span>
          </Link>
          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 30, fontSize: 15, fontWeight: 500, color: T.inkSoft }}>
            <a href="#proof">Results</a>
            <a href="#system">The Protocol</a>
            <a href="#advantage">No-Call Advantage</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Link to="/buy" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 15 }}>Claim Your Slot</Link>
        </div>
      </Wrap>
    </header>
  )
}

/* ─── Hero + VSL ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: `radial-gradient(120% 120% at 85% -10%,${T.mist} 0%,rgba(232,241,234,0) 55%),${T.paper}` }}>
      <Wrap>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(36px,5vw,72px)', alignItems: 'center', paddingBlock: 'clamp(52px,7vw,96px)' }}>
          {/* Copy */}
          <div>
            <span className="eyebrow" style={{ marginBottom: 20 }}>A system, not another attempt</span>
            <h1 style={{ fontSize: 'clamp(38px,4.7vw,60px)' }}>
              Stop starting over. Get the <em style={{ fontStyle: 'normal', color: T.forest }}>system</em> that drops 20–50+ lbs — and makes it your lifestyle.
            </h1>
            <p style={{ marginTop: 24, maxWidth: 520, fontSize: 'clamp(17px,1.5vw,20px)', color: T.inkSoft, lineHeight: 1.6 }}>
              You don't need more willpower — you need a structure to step into. The M.R.O.I. Protocol™ is the exact system coach <strong style={{ color: T.ink }}>Luke Strassner used to lose 100 lbs himself</strong>: fix your metabolic health, build the habits, make it automatic. No crash diets. Real 1-on-1 coaching with Luke, run from your phone.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 34 }}>
              <Link to="/buy" className="btn btn-vital btn-lg">Claim Your Transformation Slot <span className="arrow">→</span></Link>
            </div>
            <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ color: T.vital, letterSpacing: 2, fontSize: 15 }}>★★★★★</span>
              <span style={{ fontSize: 14.5, color: T.inkSoft }}><strong style={{ color: T.ink }}>100% app-based.</strong> Zero required Zoom calls.</span>
            </div>
            <p style={{ marginTop: 14, fontSize: 14.5, color: T.inkSoft, lineHeight: 1.55, maxWidth: 480 }}>
              No forced Zoom calls — but <strong style={{ color: T.ink }}>you're never on your own.</strong> This is real 1-on-1 coaching: Luke keeps you accountable, stays on you when it matters, and adjusts your plan as needed. You get him, not an app.
            </p>
          </div>

          {/* VSL */}
          <div style={{ position: 'relative', paddingBottom: '0', borderRadius: 18, overflow: 'hidden', boxShadow: T.shadowLg, border: `1px solid ${T.line}`, background: '#000', aspectRatio: '16 / 9' }}>
            {VSL_LOOM_ID === 'PASTE_VSL_LOOM_ID_HERE' ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: T.inkFaint, fontFamily: T.mono, fontSize: 13, textAlign: 'center', padding: 24, background: T.mist }}>
                <div style={{ width: 62, height: 62, borderRadius: '50%', background: T.forest, display: 'grid', placeItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <span style={{ fontSize: 15, color: T.inkSoft, fontWeight: 600 }}>VSL placeholder</span>
                <span>Paste your Loom ID into VSL_LOOM_ID at the top of LandingSalesPage.jsx</span>
              </div>
            ) : (
              <iframe
                src={`https://www.loom.com/embed/${VSL_LOOM_ID}?${LOOM_PARAMS}`}
                title="The M.R.O.I. Protocol — VSL"
                frameBorder="0"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            )}
          </div>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── Proof / transformation grid ──────────────────────────────────── */
const PROOF = [
  { metric: '−85 lbs', name: 'Daniel', context: 'Noticed by month 2', note: "Two months in, people are noticing. I get compliments from family, coworkers, friends. I can't recall the last time I felt this confident." },
  { metric: '−40 lbs', name: 'Larry', context: '5 months', note: 'Other coaches felt like I got handed off to a stranger. With Luke I actually get Luke. If I don\'t have enough communication it doesn\'t work for me — and this works.' },
  { metric: 'Broke 230', name: 'Sascha', context: 'Entrepreneur, father', note: 'First time in years the scale is going the right way. I broke 230 in the first couple of weeks. Nutrition-wise I\'m dialed in and the weight is moving.' },
  { metric: '−25 lbs', name: 'Gabe', context: 'First 3 months', note: 'Clothes fit better, energy is back, and my confidence with it. I finally feel like I can do this — not just a pipe dream anymore.' },
]

function Proof() {
  return (
    <section id="proof" style={{ background: T.bone, paddingBlock: 'clamp(64px,8vw,120px)' }}>
      <Wrap>
        <div style={{ maxWidth: 660, marginInline: 'auto', textAlign: 'center', marginBottom: 52 }}>
          <span className="eyebrow center">Real men. Real results.</span>
          <h2 style={{ fontSize: 'clamp(30px,4.2vw,50px)', marginTop: 18 }}>The transformation speaks for itself.</h2>
          <p style={{ marginTop: 18, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft }}>
            No gimmicks, no crash-diet before-and-afters that snap back. Just men who fixed the root and kept it off.
          </p>
        </div>
        <div className="proof-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {PROOF.map(p => (
            <article key={p.name} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 18, padding: '28px 24px', boxShadow: T.shadow, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 40, color: T.forest, letterSpacing: '-0.03em', lineHeight: 1 }}>{p.metric}</div>
              <p style={{ marginTop: 16, fontSize: 15, color: T.inkSoft, lineHeight: 1.55, flex: 1 }}>“{p.note}”</p>
              <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <b style={{ fontFamily: T.display, fontSize: 16, color: T.ink }}>{p.name}</b>
                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.moss }}>{p.context}</span>
              </div>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── The M.R.O.I. System (4 proprietary phases) ───────────────────── */
const PHASES = [
  { step: 'PHASE 01', letter: 'M', title: 'Metabolic Baseline Activation', body: 'We restore your suppressed metabolic output first — waking up an engine that years of dieting and stress ground to a halt.', plain: 'In plain English: we get your metabolic health right before we ask your body to burn fat.' },
  { step: 'PHASE 02', letter: 'R', title: 'Cellular Recovery', body: 'Systematically dismantle the chronic stress and cortisol load that quietly parks fat around your middle and stalls progress.', plain: 'In plain English: fix the sleep and stress that keep the belly fat glued on.' },
  { step: 'PHASE 03', letter: 'O', title: 'Metabolic Optimization', body: 'Now we accelerate targeted fat loss while protecting the muscle underneath, so the weight leaves and the shape stays.', plain: 'In plain English: now the weight comes off fast — without losing your muscle.' },
  { step: 'PHASE 04', letter: 'I', title: 'Identity Shift', body: 'Lock in permanent metabolic flexibility, so results become who you are — not a plan you white-knuckle and lose.', plain: 'In plain English: it sticks, so you never have to start over again.' },
]

function System() {
  return (
    <section id="system" style={{ paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 680, marginInline: 'auto', textAlign: 'center', marginBottom: 56 }}>
          <span className="eyebrow center">The engine · M.R.O.I. Protocol™</span>
          <h2 style={{ fontSize: 'clamp(32px,4.4vw,54px)', marginTop: 18 }}>A 4-phase transformation engine — not another crash diet.</h2>
          <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.5vw,20px)', color: T.inkSoft, lineHeight: 1.6 }}>
            Most programs throw you into extreme restriction and hope. The M.R.O.I. Protocol™ runs in a deliberate order, fixing your metabolic health before touching fat loss — which is exactly why it holds.
          </p>
        </div>
        <div className="phase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {PHASES.map(p => (
            <article key={p.letter} className="pillar">
              <div className="bar" />
              <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkFaint, letterSpacing: '.1em' }}>{p.step}</div>
              <div className="letter">{p.letter}</div>
              <h3 style={{ fontSize: 20 }}>{p.title}</h3>
              <p style={{ marginTop: 12, fontSize: 15, color: T.inkSoft, lineHeight: 1.55 }}>{p.body}</p>
              <p style={{ marginTop: 12, fontSize: 14, color: T.forest600, fontWeight: 600, lineHeight: 1.5, borderTop: `1px solid ${T.lineSoft}`, paddingTop: 12 }}>{p.plain}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── What your first 90 days look like (makes the system tangible) ── */
const TIMELINE = [
  { when: 'Days 1–14', title: 'You get your energy back', body: "The metabolic phase starts. No starving — the first thing you notice is steadier energy and fewer crashes. The scale usually starts moving in the first few days." },
  { when: 'Weeks 3–5', title: 'Sleep and stress get handled', body: "The recovery phase. We fix the sleep and stress that quietly hold fat on. This is the part every 'grind harder' plan skips — and why they stall." },
  { when: 'Weeks 6–9', title: 'The fat loss accelerates', body: "The optimize phase. Now the groundwork is done, your body taps into fat efficiently, and the weight comes off faster — without you white-knuckling it." },
  { when: 'Ongoing', title: 'It becomes automatic', body: "The identity phase. You stop thinking about it. You wake up knowing exactly what to do — it's just your lifestyle now, not a diet you're holding together." },
]

function First90() {
  return (
    <section style={{ paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 680, marginInline: 'auto', textAlign: 'center', marginBottom: 52 }}>
          <span className="eyebrow center">The structure</span>
          <h2 style={{ fontSize: 'clamp(30px,4.2vw,50px)', marginTop: 18 }}>What your first 90 days actually look like.</h2>
          <p style={{ marginTop: 18, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft, lineHeight: 1.6 }}>
            You want a lifestyle change but don't know how to build one. That's the point — you don't have to. Here's the path Luke puts you on, step by step.
          </p>
        </div>
        <div className="phase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {TIMELINE.map((t, i) => (
            <article key={t.when} style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 16, padding: '26px 24px', position: 'relative' }}>
              <div style={{ fontFamily: T.mono, fontSize: 12, color: T.moss, letterSpacing: '.1em', textTransform: 'uppercase' }}>{t.when}</div>
              <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 34, color: T.vitalSoft, letterSpacing: '-0.03em', margin: '10px 0 14px' }}>{String(i + 1).padStart(2, '0')}</div>
              <h3 style={{ fontSize: 18 }}>{t.title}</h3>
              <p style={{ marginTop: 12, fontSize: 14.5, color: T.inkSoft, lineHeight: 1.55 }}>{t.body}</p>
            </article>
          ))}
        </div>
        <div style={{ marginTop: 28, background: T.mist, border: `1px solid ${T.line}`, borderRadius: 16, padding: 'clamp(24px,3vw,32px)', textAlign: 'center', maxWidth: 720, marginInline: 'auto' }}>
          <p style={{ margin: 0, fontSize: 'clamp(16px,1.5vw,18px)', lineHeight: 1.65, color: T.ink }}>
            <strong>And every morning is the same simple thing:</strong> open the app, see exactly what to eat and how to train that day, and go live your life. No guessing, no decisions, no willpower tax. That's what structure actually feels like.
          </p>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── The carb paradox (the desire-builder from Luke's calls) ──────── */
function CarbEnergy() {
  return (
    <section style={{ paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 720, marginInline: 'auto', textAlign: 'center', marginBottom: 52 }}>
          <span className="eyebrow center">The part nobody believes</span>
          <h2 style={{ fontSize: 'clamp(30px,4.2vw,50px)', marginTop: 18 }}>
            Soon you'll eat <em style={{ fontStyle: 'normal', color: T.forest }}>more</em> carbs — with more energy and less body fat.
          </h2>
          <p style={{ marginTop: 18, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft, lineHeight: 1.6 }}>
            If carbs leave you sluggish and foggy right now, that's not a reason to cut them — it's a sign your metabolism isn't processing them. Fix that, and the same carbs that used to bog you down start fueling you.
          </p>
        </div>
        <div className="compare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>
          {/* Before */}
          <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 20, padding: 'clamp(28px,3.5vw,40px)' }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: T.inkFaint }}>Right now</span>
            <h3 style={{ fontSize: 24, marginTop: 12 }}>Carbs make you crash</h3>
            <p style={{ marginTop: 16, fontSize: 15.5, color: T.inkSoft, lineHeight: 1.6 }}>
              You eat, and an hour later you're sluggish, foggy, and reaching for another coffee. Your body isn't turning those carbs into energy — it's storing them. That's a metabolism that stopped working, and no amount of willpower fixes it.
            </p>
          </div>
          {/* After */}
          <div style={{ background: T.forest, color: '#fff', border: `1px solid ${T.forest}`, borderRadius: 20, padding: 'clamp(28px,3.5vw,40px)', position: 'relative', overflow: 'hidden', boxShadow: T.shadowLg }}>
            <div style={{ position: 'absolute', right: -80, top: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(70,201,139,.2),transparent 70%)', pointerEvents: 'none' }} />
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: T.vital }}>After the metabolic phase</span>
            <h3 style={{ fontSize: 24, marginTop: 12, color: '#fff' }}>Carbs become fuel</h3>
            <p style={{ marginTop: 16, fontSize: 15.5, color: 'rgba(255,255,255,.9)', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
              Once your metabolism is working, carbs give you clean, steady energy and mental clarity — so we push them <strong style={{ color: '#fff' }}>higher.</strong> You eat more, feel sharper, and the body fat keeps coming off. Most guys tell me they haven't felt this good in years.
            </p>
          </div>
        </div>
        <div style={{ marginTop: 28, background: T.mist, border: `1px solid ${T.line}`, borderRadius: 16, padding: 'clamp(24px,3vw,32px)', textAlign: 'center', maxWidth: 760, marginInline: 'auto' }}>
          <p style={{ margin: 0, fontSize: 'clamp(16px,1.5vw,18px)', lineHeight: 1.65, color: T.ink }}>
            This is the moment the whole thing gets <strong>twice as easy.</strong> Your body is finally digesting and processing nutrients the way it's meant to — and you're doing it with more energy and less effort. That's what makes it stick, instead of falling apart the first hard week.
          </p>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── You've tried before — here's why this holds ──────────────────── */
const HOLDS = [
  { title: 'Your past failures were a structure problem', body: "Not a you problem. Crash diets and 'just eat less' hand you a target and no system. The moment life gets hard, there's nothing to fall back on — so it snaps back. Every time." },
  { title: 'We fix your metabolic health first, not last', body: "Most plans push fat loss on day one and stall by week three. We build the foundation first, so by the time you'd normally quit, your body is finally working with you." },
  { title: "Luke's accountability is the safety net", body: "You've never had someone actually stay on you. When you slip, Luke notices and pulls you back — that's the difference between another failed attempt and the last one you'll ever need." },
]

function WhyItHolds() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 680, marginInline: 'auto', textAlign: 'center', marginBottom: 52 }}>
          <span className="eyebrow center">You've tried before</span>
          <h2 style={{ fontSize: 'clamp(30px,4.2vw,50px)', marginTop: 18 }}>So why would this time be different?</h2>
          <p style={{ marginTop: 18, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft, lineHeight: 1.6 }}>
            Fair question. If you've lost weight before and watched it come back, here's the honest reason it kept happening — and what changes here.
          </p>
        </div>
        <div className="get-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {HOLDS.map(h => (
            <article key={h.title} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 18, padding: 'clamp(26px,3vw,34px)' }}>
              <h3 style={{ fontSize: 19 }}>{h.title}</h3>
              <p style={{ marginTop: 12, fontSize: 15, color: T.inkSoft, lineHeight: 1.6 }}>{h.body}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── The No-Call Advantage (comparison) ───────────────────────────── */
const X_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 16, height: 16, flexShrink: 0 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const CHECK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 16, height: 16, flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const TRADITIONAL = ['Endless 45-minute Zoom calls to schedule around', '$3k–$5k upfront before you see a plan', 'High-friction check-ins that eat your week', 'Generic templates dressed up as “custom”', 'Your progress waits on someone else’s calendar']
const ASYNC = ['No forced Zoom calls — 1-on-1 coaching that fits your life', 'Direct access to Luke, not a support queue', 'Real accountability — he stays on you and keeps you on track', 'Your plan adjusted as needed, whenever progress demands', "You're his client — never a face in a group"]

function Advantage() {
  return (
    <section id="advantage" style={{ background: T.bone, paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 680, marginInline: 'auto', textAlign: 'center', marginBottom: 52 }}>
          <span className="eyebrow center">The No-Call Advantage</span>
          <h2 style={{ fontSize: 'clamp(30px,4.2vw,50px)', marginTop: 18 }}>Everything high-ticket coaching gets right — none of the friction.</h2>
          <p style={{ marginTop: 18, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft }}>
            You don't need another standing Zoom appointment. You need a system that moves as fast as you do.
          </p>
        </div>
        <div className="compare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>
          {/* Traditional */}
          <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 20, padding: 'clamp(28px,3.5vw,40px)' }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: T.inkFaint }}>The old way</span>
            <h3 style={{ fontSize: 24, marginTop: 12 }}>Traditional High-Ticket Coaching</h3>
            <ul style={{ listStyle: 'none', margin: '24px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {TRADITIONAL.map(t => (
                <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: T.inkSoft, fontSize: 15.5, lineHeight: 1.5 }}>
                  <span style={{ color: '#B4530F', marginTop: 2 }}>{X_ICON}</span>{t}
                </li>
              ))}
            </ul>
          </div>
          {/* Async */}
          <div style={{ background: T.forest, color: '#fff', border: `1px solid ${T.forest}`, borderRadius: 20, padding: 'clamp(28px,3.5vw,40px)', position: 'relative', overflow: 'hidden', boxShadow: T.shadowLg }}>
            <div style={{ position: 'absolute', right: -80, top: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(70,201,139,.2),transparent 70%)', pointerEvents: 'none' }} />
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: T.vital }}>The M.R.O.I. way</span>
            <h3 style={{ fontSize: 24, marginTop: 12, color: '#fff' }}>The M.R.O.I. 1-on-1 System</h3>
            <ul style={{ listStyle: 'none', margin: '24px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
              {ASYNC.map(t => (
                <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: 'rgba(255,255,255,.9)', fontSize: 15.5, lineHeight: 1.5 }}>
                  <span style={{ color: T.vital, marginTop: 2 }}>{CHECK_ICON}</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── What you get (deliverables) ──────────────────────────────────── */
const DELIVERABLES = [
  { n: '01', title: 'Custom Training & Nutrition App', body: 'Your entire plan lives in one app — programming, targets, and daily habits, updated as you progress. Open it and know exactly what to do.' },
  { n: '02', title: 'The Exclusive M.R.O.I. Video Vault', body: 'A private resource system that walks you through every phase of the protocol on demand, so the “why” behind each move is always a tap away.' },
  { n: '03', title: 'Direct 1-on-1 Accountability', body: "Luke tracks your progress and stays on you — checking in, holding you accountable, and adjusting your plan as needed. You're coached by him directly, never left to figure it out alone." },
]

function WhatYouGet() {
  return (
    <section style={{ paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div style={{ maxWidth: 680, marginInline: 'auto', textAlign: 'center', marginBottom: 52 }}>
          <span className="eyebrow center">What's inside</span>
          <h2 style={{ fontSize: 'clamp(30px,4.2vw,50px)', marginTop: 18 }}>Everything you need, nothing you don't.</h2>
        </div>
        <div className="get-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {DELIVERABLES.map(d => (
            <article key={d.n} style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 18, padding: 'clamp(28px,3vw,36px)' }}>
              <div style={{ fontFamily: T.mono, fontSize: 13, color: T.moss, letterSpacing: '.14em' }}>{d.n}</div>
              <h3 style={{ fontSize: 21, marginTop: 14 }}>{d.title}</h3>
              <p style={{ marginTop: 14, fontSize: 15.5, color: T.inkSoft, lineHeight: 1.6 }}>{d.body}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── How support actually works (kills the "get abandoned" fear) ──── */
const SUPPORT = [
  { title: "You're coached by Luke, 1-on-1", body: "Not a template, not an app you're left alone with, not an assistant overseas. Luke coaches you directly — you're his client and he treats you like it." },
  { title: 'Real accountability, not willpower', body: "He stays on you. When you start slipping, he reaches out and pulls you back on track — that accountability is the difference between another failed attempt and this being the last one." },
  { title: 'Adjustments as needed', body: "Your plan changes whenever your progress or your life demands it — not on some rigid schedule. Something stalls, it gets fixed. You're never guessing what to do next." },
]

function SupportWorks() {
  return (
    <section style={{ background: T.bone, paddingBlock: 'clamp(64px,8vw,120px)' }}>
      <Wrap>
        <div style={{ maxWidth: 680, marginInline: 'auto', textAlign: 'center', marginBottom: 48 }}>
          <span className="eyebrow center">You're not doing this alone</span>
          <h2 style={{ fontSize: 'clamp(30px,4.2vw,50px)', marginTop: 18 }}>What 1-on-1 actually means here.</h2>
          <p style={{ marginTop: 18, fontSize: 'clamp(16px,1.4vw,19px)', color: T.inkSoft, lineHeight: 1.6 }}>
            The fear with online coaching is paying, then getting handed an app and ghosted. That's the opposite of this. Here's what your $75/week actually buys.
          </p>
        </div>
        <div className="get-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {SUPPORT.map((s, i) => (
            <article key={s.title} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 18, padding: 'clamp(26px,3vw,34px)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: T.mist, color: T.forest, display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 17 }}>{i + 1}</div>
              <h3 style={{ fontSize: 19, marginTop: 16 }}>{s.title}</h3>
              <p style={{ marginTop: 12, fontSize: 15, color: T.inkSoft, lineHeight: 1.6 }}>{s.body}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ─── Bottom CTA banner ────────────────────────────────────────────── */
function CtaBanner() {
  return (
    <section style={{ background: T.forest, color: '#fff', position: 'relative', overflow: 'hidden', paddingBlock: 'clamp(64px,8vw,120px)' }}>
      <div style={{ position: 'absolute', right: -120, top: -120, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(70,201,139,.22),transparent 68%)', pointerEvents: 'none' }} />
      <Wrap style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 760 }}>
        <span className="eyebrow vital center">Why intake is capped</span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(30px,4.2vw,52px)', marginTop: 18 }}>
          I read every man's data myself. That's the whole cap.
        </h2>
        <p style={{ marginTop: 20, fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(255,255,255,.82)', maxWidth: 620, marginInline: 'auto', lineHeight: 1.6 }}>
          There's no fake countdown here. The limit is real and simple: I personally review every client's numbers each week, so I can only take a handful of new men at a time. When the roster's full, the page tells you it's full — no games. If a slot's open, it's open now.
        </p>
        <p style={{ marginTop: 18, fontSize: 'clamp(16px,1.4vw,18px)', color: 'rgba(255,255,255,.7)', maxWidth: 620, marginInline: 'auto', lineHeight: 1.6 }}>
          And be honest about the alternative: another year of the same — heavier, more tired, the habits dug in deeper. It only gets harder to turn around, never easier. Starting today is the cheapest and simplest it will ever be.
        </p>
        <div style={{ marginTop: 34 }}>
          <Link to="/buy" className="btn btn-vital btn-lg">Apply For The M.R.O.I. Protocol <span className="arrow">→</span></Link>
        </div>
      </Wrap>
    </section>
  )
}

/* ─── FAQ ──────────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'Why are there no forced weekly Zoom calls?', a: "Because a standing 45-minute Zoom doesn't get you results — the coaching and the accountability do. You get direct 1-on-1 access to Luke and your plan adjusted as needed, without rearranging your week around an appointment. Less friction, not less coaching." },
  { q: 'How does the 1-on-1 coaching actually work?', a: "You log your training, food and numbers in the app, and Luke coaches off that directly — holding you accountable, staying on you when you slip, and adjusting your plan as needed. It's real 1-on-1 accountability from Luke himself, delivered around your schedule instead of a rigid weekly slot." },
  { q: 'Who is this protocol designed for?', a: "Men who are ready to lose 20–50+ lbs and are done with crash diets that snap back. If you want a metabolic-first system you can actually run around a busy life — without endless calls — this is built for you." },
  { q: 'Do I need a gym or special equipment?', a: "No. Your training plan is built around what you have access to and updated as you progress. The point is a plan that fits your life, not one that forces your life to fit it." },
  { q: "I don't have time — my schedule is chaos.", a: "That's exactly who the system is built for. It removes the decisions instead of adding them — you open the app and know what to do, no planning required. Luke coaches men working 60–70 hour weeks; the structure flexes to your schedule, not the other way around." },
  { q: 'What if I fall off like last time?', a: "Last time you didn't have someone staying on you. That's the whole job of the accountability — when you slip, Luke pulls you back before it becomes another quit. The structure is the safety net you've never had." },
  { q: 'How much does it cost?', a: "It's $75/week on a 90-day program — about $11 a day, and a fraction of the $3,000–$5,000 in-person coaching runs. Every detail, plus the guarantee, is on the enrollment page. No surprises at checkout." },
  { q: 'What makes this different from every other program?', a: "The order of operations. The M.R.O.I. Protocol™ fixes your metabolic health and recovery before pushing fat loss, so by the time most people plateau, your body is working with you. That's why the results hold instead of bouncing back." },
]

function Faq() {
  return (
    <section id="faq" style={{ background: T.bone, paddingBlock: 'clamp(72px,9vw,140px)' }}>
      <Wrap>
        <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(36px,5vw,80px)', alignItems: 'start' }}>
          <div>
            <span className="eyebrow">FAQ</span>
            <h2 style={{ fontSize: 'clamp(30px,4vw,46px)', marginTop: 18 }}>Straight answers.</h2>
            <div style={{ marginTop: 32, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: '28px' }}>
              <h3 style={{ fontSize: 19 }}>Ready to start?</h3>
              <p style={{ marginTop: 12, color: T.inkSoft, fontSize: 15 }}>Claim your slot and you'll see the full offer and onboarding on the next page.</p>
              <Link to="/buy" className="btn btn-primary" style={{ marginTop: 20 }}>Claim Your Slot</Link>
            </div>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <details key={i} className="faq" open={i === 0}>
                <summary>{f.q}<span className="ico" /></summary>
                <div className="ans">{f.a}</div>
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
    <footer style={{ background: T.ink, color: '#fff', paddingBlock: 'clamp(44px,6vw,72px)' }}>
      <Wrap>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 18 }}>Chainmover Fitness</span>
          </div>
          <Link to="/buy" className="btn btn-vital">Claim Your Transformation Slot <span className="arrow">→</span></Link>
        </div>
        <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 14 }}>© 2026 Chainmover Fitness. All rights reserved.</span>
          <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 12.5, maxWidth: 720, lineHeight: 1.55 }}>
            Results vary. The M.R.O.I. Protocol™ is a coaching program and is not medical advice or a substitute for your physician. Always consult a qualified healthcare provider for your specific situation.
          </span>
        </div>
      </Wrap>
    </footer>
  )
}

/* ─── Root ─────────────────────────────────────────────────────────── */
export default function LandingSalesPage() {
  useFonts()
  return (
    <div className="mroi-lp">
      <style>{CSS}</style>
      <Header />
      <main>
        <Hero />
        <Proof />
        <System />
        <First90 />
        <CarbEnergy />
        <WhyItHolds />
        <Advantage />
        <WhatYouGet />
        <SupportWorks />
        <CtaBanner />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
