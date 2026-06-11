import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'

/* ─── shared links ─────────────────────────────────────────────────── */
const OVERVIEW_URL = 'https://linktw.in/foHoIb'
const IG_URL = 'https://instagram.com/luke.strassner.fit'
const CALENDLY_URL = 'https://calendly.com/luke-strassner-fit/1-1-mentorship-session'

/* ─── brand tokens (match landing page) ────────────────────────────── */
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

/* ─── inline markdown (bold / italic / links) ──────────────────────── */
function renderInline(text, kp) {
  const nodes = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|(https?:\/\/[^\s)]+)/g
  let last = 0, m, i = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[1] !== undefined) {
      nodes.push(<strong key={`${kp}-b${i}`} style={{ color: T.ink, fontWeight: 700 }}>{m[1]}</strong>)
    } else if (m[2] !== undefined) {
      nodes.push(<em key={`${kp}-i${i}`}>{m[2]}</em>)
    } else if (m[3] !== undefined) {
      nodes.push(<a key={`${kp}-a${i}`} href={m[3]} target="_blank" rel="noreferrer" style={{ color: T.forest, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}>{m[3]}</a>)
    }
    last = re.lastIndex; i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/* ─── block parser ─────────────────────────────────────────────────── */
function parseBlocks(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let para = [], i = 0
  const flush = () => { if (para.length) { blocks.push({ type: 'p', text: para.join(' ') }); para = [] } }
  while (i < lines.length) {
    const t = lines[i].trim()
    if (t === '') { flush(); i++; continue }
    if (t === '---') { flush(); blocks.push({ type: 'hr' }); i++; continue }
    if (t.startsWith('### ')) { flush(); blocks.push({ type: 'h3', text: t.slice(4) }); i++; continue }
    if (t.startsWith('## '))  { flush(); blocks.push({ type: 'h2', text: t.slice(3) }); i++; continue }
    if (t.startsWith('# '))   { flush(); blocks.push({ type: 'h1', text: t.slice(2) }); i++; continue }
    if (t.startsWith('|')) {
      flush()
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++ }
      blocks.push({ type: 'table', rows })
      continue
    }
    para.push(t); i++
  }
  flush()
  return blocks
}

function parseRow(r) {
  return r.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim())
}

/* ─── renderers ────────────────────────────────────────────────────── */
function Table({ rows, accent }) {
  const cells = rows.map(parseRow)
  const header = cells[0]
  const bodyRows = cells.slice(2) // skip the |---| separator
  return (
    <div style={{ overflowX: 'auto', margin: '28px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14.5, minWidth: 480 }}>
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i} style={{
                textAlign: 'left', padding: '12px 14px', background: T.forest, color: '#fff',
                fontFamily: T.mono, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 500,
                borderRight: i < header.length - 1 ? '1px solid rgba(255,255,255,.12)' : 'none',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? T.bone : T.paper }}>
              {row.map((c, ci) => (
                <td key={ci} style={{
                  padding: '11px 14px', borderTop: `1px solid ${T.line}`, color: ci === 0 ? T.ink : T.inkSoft,
                  fontWeight: ci === 0 ? 600 : 400, verticalAlign: 'top',
                  borderRight: ci < row.length - 1 ? `1px solid ${T.lineSoft}` : 'none',
                  ...(ci === header.length - 1 ? { color: accent, fontWeight: 600 } : {}),
                }}>{renderInline(c, `t${ri}${ci}`)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderBlocks(blocks, accent) {
  const out = []
  let i = 0
  while (i < blocks.length) {
    const b = blocks[i]
    const key = `b${i}`

    if (b.type === 'hr') {
      out.push(<div key={key} style={{ height: 1, background: T.line, margin: '40px 0' }} />)
      i++; continue
    }

    if (b.type === 'h3') {
      // Guarantee → forest callout card grouping until next hr
      if (b.text.toLowerCase().includes('chainmover guarantee')) {
        const group = []
        let j = i + 1
        while (j < blocks.length && blocks[j].type !== 'hr') { group.push(blocks[j]); j++ }
        out.push(
          <div key={key} style={{ background: T.forest, color: '#fff', borderRadius: 18, padding: 'clamp(28px,4vw,44px)', margin: '44px 0', boxShadow: T.shadow }}>
            <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.vital }}>The Chainmover Guarantee</span>
            {group.map((g, gi) => {
              if (g.type === 'p' && /^\*\*.+\*\*$/.test(g.text.trim())) {
                return <h3 key={gi} style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(26px,3.4vw,38px)', color: '#fff', margin: '14px 0 18px' }}>{g.text.replace(/\*\*/g, '')}</h3>
              }
              return <p key={gi} style={{ color: 'rgba(255,255,255,.82)', fontSize: 16.5, lineHeight: 1.7, marginBottom: 16 }}>{renderInline(g.text, `g${gi}`)}</p>
            })}
          </div>
        )
        i = j; continue
      }
      out.push(
        <h3 key={key} style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(22px,2.6vw,30px)', color: T.ink, margin: '48px 0 18px', paddingTop: 22, borderTop: `2px solid ${accent}`, display: 'inline-block', width: '100%', letterSpacing: '-0.02em' }}>
          {b.text}
        </h3>
      )
      i++; continue
    }

    if (b.type === 'h2') {
      out.push(<h2 key={key} style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(24px,3vw,34px)', color: T.ink, margin: '32px 0 16px' }}>{b.text}</h2>)
      i++; continue
    }

    if (b.type === 'table') {
      out.push(<Table key={key} rows={b.rows} accent={accent} />)
      i++; continue
    }

    // paragraphs + special cases
    const text = b.text.trim()

    // CTA: the overview line
    if (/Watch the step by step overview/i.test(text)) {
      out.push(
        <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, margin: '20px 0 8px' }}>
          <a href={OVERVIEW_URL} target="_blank" rel="noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, background: T.vital, color: T.forest,
            fontFamily: T.body, fontWeight: 700, fontSize: 17, padding: '17px 32px', borderRadius: 100,
            textDecoration: 'none', boxShadow: '0 8px 22px rgba(70,201,139,.3)',
          }}>Watch the Step-by-Step Overview →</a>
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, background: T.forest, color: '#fff',
            fontFamily: T.body, fontWeight: 700, fontSize: 17, padding: '17px 32px', borderRadius: 100,
            textDecoration: 'none', boxShadow: '0 8px 22px rgba(20,61,43,.28)',
          }}>Book a Call With Luke →</a>
        </div>
      )
      i++; continue
    }

    // Instagram handle line
    if (text === '@luke.strassner.fit') {
      out.push(
        <p key={key} style={{ textAlign: 'center', margin: '12px 0 0' }}>
          <a href={IG_URL} target="_blank" rel="noreferrer" style={{ fontFamily: T.mono, fontSize: 14, color: T.moss, letterSpacing: '.04em', textDecoration: 'none' }}>@luke.strassner.fit</a>
        </p>
      )
      i++; continue
    }

    // Fully-italic disclaimer
    if (/^\*[^*].*\*$/.test(text) && !text.startsWith('**')) {
      out.push(
        <p key={key} style={{ fontSize: 12.5, lineHeight: 1.6, color: T.inkFaint, fontStyle: 'italic', marginTop: 32, paddingTop: 24, borderTop: `1px solid ${T.line}` }}>
          {text.replace(/^\*|\*$/g, '')}
        </p>
      )
      i++; continue
    }

    out.push(
      <p key={key} style={{ fontSize: 17, lineHeight: 1.75, color: T.inkSoft, marginBottom: 18 }}>
        {renderInline(text, key)}
      </p>
    )
    i++
  }
  return out
}

/* ─── header ───────────────────────────────────────────────────────── */
function DocHeader() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }} />
        </Link>
        <Link to="/quiz" style={{
          background: T.forest, color: '#fff', fontFamily: T.body, fontWeight: 600, fontSize: 15,
          padding: '11px 20px', borderRadius: 100, textDecoration: 'none',
        }}>Retake the Assessment</Link>
      </div>
    </header>
  )
}

/* ─── document page shell ──────────────────────────────────────────── */
function DocPage({ meta }) {
  useFonts()
  const blocks = parseBlocks(meta.md)
  return (
    <div style={{ background: T.paper, minHeight: '100svh', fontFamily: T.body, color: T.ink }}>
      <DocHeader />

      {/* hero band */}
      <section style={{ background: `linear-gradient(180deg, ${meta.accentSoft} 0%, rgba(255,255,255,0) 100%)`, borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ maxWidth: 820, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', paddingBlock: 'clamp(48px,7vw,88px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
            <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss }}>Metabolic Risk Assessment</span>
            <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', background: meta.accent, padding: '5px 12px', borderRadius: 100 }}>
              {meta.level} · {meta.tag}
            </span>
          </div>
          <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(34px,5.5vw,58px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
            {meta.name}
          </h1>
          <p style={{ marginTop: 22, fontSize: 'clamp(17px,1.6vw,21px)', lineHeight: 1.6, color: T.inkSoft, maxWidth: 640 }}>
            {meta.intro}
          </p>
        </div>
      </section>

      {/* reading column */}
      <article style={{ maxWidth: 820, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', paddingBlock: 'clamp(40px,5vw,64px)' }}>
        {renderBlocks(blocks, meta.accent)}
      </article>

      {/* footer */}
      <footer style={{ background: T.ink, color: '#fff', paddingBlock: 40 }}>
        <div style={{ maxWidth: 820, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
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

/* ─── content ──────────────────────────────────────────────────────── */
const EARLY_MD = `Your labs look fine. Your doctor isn't worried yet.

That is exactly what makes this stage the most dangerous one.

---

### What This Is

This is not a weight loss guide. It is a biological status report.

By the end of it you will know three things. What is actually happening inside your body right now. Why this specific window matters more than any stage that comes after it. And the exact path forward, step by step, starting today.

This was built from working directly with men at every stage of metabolic dysfunction. What follows is what most doctors do not have time to explain and what most coaches do not understand well enough to teach.

---

### 01. What You Are Experiencing

These are not random. They are a connected cluster of early signals that look unrelated on the surface and trace back to the same root underneath.

**Energy that craters by 2pm.** You are sharp in the morning and drained by mid afternoon. Coffee stopped fixing it. This is not a caffeine problem.

**Belly fat that arrived quietly.** You did not gain it all at once. It compounded slowly, year over year, with no dramatic change in how you ate. That is a cortisol and insulin pattern, not a character pattern.

**Sleep that does not restore.** You log seven or eight hours and wake up already tired. Being asleep is not the same as sleeping. Your body is not recovering during those hours the way it should.

**Brain fog that comes and goes.** Thoughts feel slower than they used to. You reach for more caffeine, which raises cortisol, which makes the root cause worse. You have been treating the symptom and feeding the problem at the same time.

**Drive that quietly flatlined.** You used to feel hungry for things. Now you are getting through the week. This is not you getting older. It is a hormonal signal that something upstream has shifted.

**Food noise you cannot shut off.** You think about food constantly. The cravings feel biological, not mental. That is because they are. Unstable blood sugar makes the brain scream for glucose specifically.

You have been told these are six separate problems. They are six symptoms of one problem.

---

### 02. What Is Happening Under The Surface

These are the markers that show the truth your scale cannot. Most men at this stage have never seen them explained together. Pull your last blood panel, or ask your doctor to run every one of these at your next visit.

| Marker | Optimal | Early Warning |
|---|---|---|
| Fasting Glucose | 70 to 85 mg/dL | 90 to 99 mg/dL |
| Hemoglobin A1C | Below 5.3% | 5.3% to 5.6% |
| Fasting Insulin | Below 8 uIU/mL | 8 to 15 uIU/mL |
| Total Testosterone | 550 to 800 ng/dL | 350 to 500 ng/dL |
| Triglycerides | Below 100 mg/dL | 100 to 149 mg/dL |
| HDL Cholesterol | Above 55 mg/dL | 45 to 54 mg/dL |
| hsCRP (Inflammation) | Below 0.5 mg/L | 0.5 to 1.5 mg/L |

**A note on the word normal.** Your doctor's ranges are built around population averages, not optimal function. A fasting glucose of 98 and a testosterone of 380 both come back unflagged. Neither is optimal. Normal means you are not sick yet. Optimal means your biology is working for you instead of quietly against you.

---

### 03. Why This Stage Matters More Than Any Other

Most men read their labs, see no red flags, and do nothing. That is the trap. Here is what is compounding while you wait.

**The biology only moves one direction on its own.** A fasting glucose in the 90s does not drift back down by itself. Without changing the inputs driving it, it climbs. Every year inside this zone shifts the odds toward prediabetes and then type 2. The window you are in right now is the most reversible one that will ever exist for this.

**Your doctor will not sound the alarm.** Nothing is flagged red, so you leave with no plan. The absence of a warning is not the absence of a problem. It means the problem has not crossed an administrative line yet.

**Visceral fat is not just sitting there.** The fat around your organs is active tissue. It secretes inflammatory signals, worsens insulin resistance, and converts your testosterone into estrogen. Every year it stays, it drags the other markers down with it.

**The cost is invisible until it is not.** This is not a crisis today. That is exactly why men do not move. The same biology running uncorrected for five more years produces a very different panel and a much harder problem to reverse.

**This is already touching your career.** Low normal testosterone is not an aesthetics issue. It blunts drive, dulls competitive edge, and quietly lowers the cognitive output your income depends on. You have normalized a ceiling that is not your real one.

---

### 04. What Life Looks Like On The Other Side

This is the part nobody describes for you, so here it is plainly.

Your energy holds. The 2pm crash stops showing up. You get to the end of the workday with something left for your life instead of collapsing onto the couch.

The food noise goes quiet. You stop negotiating with yourself at 10pm. Eating becomes a decision you make, not a pull you resist.

Your head runs clean past noon. The fog lifts. The sharpness you used to take for granted comes back, and you feel it on every call and in every hard problem.

Your body starts to match everything else you have built. The reflection stops surprising you. You stop angling out of photos.

And the part most men do not say out loud. The athlete you used to be was never gone. He got buried under deadlines and bad inputs. This is the process that digs him back out.

That is the outcome. The next section is how you start moving toward it today.

---

### 05. The Path Forward, Step By Step

You do not need a perfect plan. You need the right inputs in the right order. Start here.

**1. Anchor your protein first.** Eat one gram of protein per pound of your target bodyweight every day. Protein is the one input that kills hunger, protects your muscle while fat comes off, and steadies blood sugar better than anything else on your plate. Hit this before you worry about anything else.

**2. Stop eating naked carbs.** Never eat carbohydrates alone. Always pair them with protein, fat, or fiber. This one habit flattens the spike and crash that drives your afternoon energy dip and your cravings.

**3. Build a high volume plate.** Fill most of your plate with lean protein and vegetables before anything else goes on it. You eat a large amount of food, you stay full, and the calories still come down on their own. No restriction. No tiny portions.

**4. Set a movement floor.** Walk 10,000 steps a day and lift three times a week. Steps improve insulin sensitivity and burn real calories without spiking the stress response. Lifting tells your body to hold onto muscle while you lose fat. Three sessions is enough. You do not need more.

**5. Fix sleep quality, not just hours.** Get sunlight in your eyes within thirty minutes of waking. Cut caffeine after 2pm. Keep the room cool and dark. Hold a consistent wake time, even on weekends. Deep sleep is when testosterone and growth hormone are released. Protect it.

**6. Run the foundation supplements.** Creatine, five grams a day. Magnesium glycinate in the evening. Omega 3 with meals. Vitamin D, and get your level tested so you know your dose. Most men are low on all four, and being low is directly dragging the markers above in the wrong direction.

**7. Name your cortisol drivers.** Cortisol is a bigger fat loss variable than calories for most men at this stage. Find the specific things spiking yours. Late night screens, skipped meals, no decompression after work. Remove or blunt them one at a time.

Do these in order. Protein and steps first. Sleep and supplements next. Everything else builds on top of those. Simple done every day beats perfect done once in a while, every single time.

---

### The Chainmover Guarantee

**50 lbs. Guaranteed.**

When you join the Codex, you lose 50 lbs of fat or I coach you for free until you do. Not a discount. Not a refund. I keep working until the result is real.

This guarantee exists because the method is not guesswork. It is a leveled system built from 120 lbs of lived experience, applied directly by the person who built it. Every client works with me personally. No handoffs. No sub coaches. No AI.

---

You now know what is happening, why it matters now, and the exact path out.

The next step is seeing how the full system fits together from start to finish.

**Watch the step by step overview: ${OVERVIEW_URL}**

@luke.strassner.fit

*Chainmover Fitness. Luke Strassner. This document is for educational purposes based on lived experience and current research. It is not medical advice. Always work with a qualified healthcare provider for your specific situation.*`

const STRESS_MD = `Your labs may still be called borderline. Your body stopped being borderline a while ago.

---

### What This Is

This is not a weight loss guide. It is a biological status report.

Level 2 is where the biology becomes active. The early signals from Level 1 have had time to compound, and now multiple systems are reporting dysfunction at the same time.

By the end of this you will know three things. What is happening across those systems right now. Why this stage is a turning point and not just the next step down. And the exact path to reverse it, step by step, starting today.

Most men at this stage have been told they are borderline on at least one marker. Borderline is a clinical word for "we can see it moving in the wrong direction, but it has not crossed our line yet." The line is not the point. The direction is.

---

### 01. What You Are Experiencing

At Level 2 the symptoms are no longer subtle. They show up every day. Most men have started blaming age, stress, or personality. It is none of those.

**Belly fat that does not move.** You have cut calories. You have cut carbs. The midsection stays. This is not a deficit problem. At this point, we need a calorie deficit paired with a reduction in cortisol and increased insulin sensitivity to see the best results.

**Energy crashes that need caffeine to function.** Not an afternoon dip. A hard crash that makes focused work impossible without a stimulant. The caffeine doesn't fix anything, it just masks the issue. You are managing a loop, not fixing a problem. Sleep quality, sunlight early, and stress management are key to breaking this cycle.

**Anxiety with no clear source.** A low level hum of dread that is there even when nothing is wrong. Snapping at people for no reason. Waking up already tense. This is not in your head. Chronically high cortisol holds your nervous system in a threat state that feels like normal until someone names it. It almost feels like you're bracing for a threat that isn't there. So you're constantly on edge.

**Sleep that happens but does not restore.** You fall asleep. You might stay asleep. You wake up exhausted and feeling like a train hit you overnight. High evening cortisol is suppressing your deep sleep, and deep sleep is when testosterone and growth hormone are released at night. Break the sleep, drop both outputs.

**Libido and recovery that quietly collapsed.** You are not bouncing back between sessions the way you used to. Drive is flat across the board. These are direct signs of testosterone suppression, nutrient deficiency, and chronic stress.

**Cravings that feel like they come from somewhere else.** For sugar and carbs specifically. In the afternoon and late at night. 

**Blood pressure creeping up.** Often the first number your doctor flags. High blood pressure here is downstream of the same cortisol and insulin pattern driving everything else. Treating that number alone, while the cause keeps compounding, is managing a symptom. Medications help for this, but it's not a long-term solution.

---

### 02. What Is Happening Under The Surface

These are the markers that confirm active dysfunction. Ask for every one of these at your next appointment. The right column is where most men at this stage actually land.

| Marker | Optimal | What we don't want to see |
|---|---|---|
| Fasting Glucose | 70 to 85 mg/dL | 100 to 125 mg/dL (prediabetic) |
| Hemoglobin A1C | Below 5.3% | 5.7% to 6.4% (prediabetic) |
| Fasting Insulin | Below 8 uIU/mL | 15 to 25+ uIU/mL (insulin resistant) |
| Total Testosterone | 550 to 800 ng/dL | Below 400 ng/dL (suppressed) |
| Triglycerides | Below 100 mg/dL | 150 to 199 mg/dL (elevated) |
| HDL Cholesterol | Above 55 mg/dL | Below 45 mg/dL (low) |
| hsCRP (Inflammation) | Below 0.5 mg/L | 1.5 to 3.0 mg/L (inflamed) |
| Liver Enzymes (ALT) | Below 25 U/L | 30 to 55 U/L (early fatty liver signal) |

**The insulin number your doctor is not running.** Fasting insulin is the single most revealing marker at this stage, and it is almost never on a standard panel. A fasting glucose of 108 looks concerning on its own. A fasting insulin of 22 tells you your body is working five times harder than it should to manage that glucose. This directly shows us whether insulin resistance is present. If you're worried about that, I would ask for it next time you get labs!

---

### 03. Why This Is A Turning Point

Level 1 was the window. Level 2 is the decision point. The biology is no longer drifting. It is running an active loop. Here is what that means in plain terms.

**Seventy percent of people in the prediabetic range progress to type 2.** Without real intervention, the odds of reversal drop with every year spent here. The trajectory is not neutral. It is pointed. The question is not whether things change. It is whether you are the one who changes them.

**Testosterone this low is no longer about aesthetics.** Below 400, the suppression is dulling your drive, slowing your recovery from every kind of stress including work, and lowering the cognitive output your career runs on. That feeling of being slower than you used to be has a number behind it.

**Visceral fat is now making every other marker worse.** It is not just stored. It is secreting inflammatory signals that deepen insulin resistance, converting your testosterone into estrogen, and feeding the cortisol problem that is wrecking your sleep. Every system is pushing every other system the wrong way.

**The compounding has momentum now.** Poor sleep suppresses testosterone. Low testosterone makes fat loss harder (but not impossible). More belly fat raises cortisol. High cortisol destroys sleep. You cannot fix one marker and wait for the rest to follow. The loop has to be hit at several points at once. This is why 'starting slow' hasn't fixed your issues yet.

**Early fatty liver changes the conversation.** Rising liver enzymes mean your liver is starting to store fat. Non alcoholic fatty liver disease is the downstream result of years of insulin resistance. It is reversible at this stage. It gets much harder to reverse past it. It's always much easier to prevent than to reverse.

---

### 04. What Reversal Looks Like

This is the part nobody describes for you, so here it is plainly.

The hard crash stops. You get through the afternoon without a stimulant just to think straight (and caffiene works much better now too). The loop you have been managing finally goes quiet.

The cravings fade. The 10pm pull stops. Food becomes a decision again instead of a force acting on you.

Your sleep starts to restore. You wake up with energy instead of reaching for caffeine to feel human. Recovery between training sessions comes back.

Your drive returns. The flatness lifts. That competetive edge you used to have returns. Working out feels great, and you're not just surviving the session, you're enjoying it.

And the markers move. The glucose comes down. The insulin drops. The testosterone climbs. The liver clears. The same panel that scared you starts reading like a different man's. Because it is.

That is the outcome. The next section is how you start reversing it today.

---

### 05. The Path Forward, Step By Step

At Level 2 you cannot outwork the biology with effort alone. Every broken system is making the others harder to fix, so the loop has to be hit at several points at once. Start here, in this order.

**1. Lock the foundation first, no exceptions.** Steps, protein, training, sleep. Not a warmup to the real work. This is the real work. Most men at this stage want to jump to advanced tools. The advanced tools do nothing on a broken foundation. Simple done every day is the strongest metabolic lever you have.

**2. Anchor your protein.** One gram of protein per pound of your target bodyweight, every day. Protein kills hunger, protects muscle while fat comes off, and steadies blood sugar better than anything else on your plate. This is the single input that changes the most, fastest.

**3. Stabilize your blood sugar with food order.** Never eat carbs alone. Eat protein and vegetables first, carbs last. Stop drinking your sugar. This flattens the glucose spike and the crash that triggers the cortisol response and the cravings underneath your whole day. This is what makes a deficit actually hold.

**4. Set a hard movement floor.** Walk 10,000 steps a day and lift three times a week. Steps directly improve insulin sensitivity and pull glucose out of your blood without spiking the stress response. Lifting protects your muscle while you lose fat. Three sessions is enough.

**5. Attack sleep as a hormonal fix.** Sunlight in your eyes within thirty minutes of waking. No caffeine after 2pm. A real wind down with no screens for the last hour. Cool, dark room. Same wake time every day. At this stage, fixing sleep is how you lift testosterone and lower cortisol. Treat it like the intervention it is.

**6. Map your cortisol drivers and cut them one at a time.** At Level 2, cortisol is a primary driver, not background noise. Find the specific things spiking yours. Late nights, eating on deadline, no decompression after work, doomscrolling in bed. Pick the biggest one and build a different default around it. Then the next.

**7. Run the corrective supplements.** Creatine, five grams a day, for muscle and cognitive output. Magnesium glycinate in the evening for cortisol and sleep. Omega 3 with meals for inflammation. Vitamin D, tested, for testosterone support. These are not optimization at Level 2. They are correcting deficits that are dragging your markers down right now. If you are insulin resistant, ask your doctor whether berberine fits your situation, since it has real glucose lowering effects and can interact with medication.

**8. If you are on a GLP-1, build the system under it.** Ozempic, Wegovy, and retatrutide handle the appetite and glucose side. What they cannot do is build the habits that keep the result when the drug stops. The foundation above is what you own when the medication is done. Without it, you are renting the result.

Do these in order. Foundation, protein, and blood sugar first. Sleep, cortisol, and supplements next. The medication conversation sits on top of all of it. Simple done every day beats perfect done once in a while, every single time.

---

### The Chainmover Guarantee

**50 lbs. Guaranteed.**

When you join the Codex, you lose 50 lbs of fat or I coach you for free until you do. Not a discount. Not a refund. I keep working until the result is real.

At Level 2, the cost of not acting is not staying the same. Every month inside this loop compounds the biology against you. The guarantee exists because reversing this is exactly what the Codex was built to do, and I work with every client directly until it is done. No handoffs. No sub coaches. No AI.

---

You now know what is happening, why this is the turning point, and the exact path to reverse it.

The next step is seeing how the full system fits together from start to finish.

**Watch the step by step overview: ${OVERVIEW_URL}**

@luke.strassner.fit

*Chainmover Fitness. Luke Strassner. This document is for educational purposes based on lived experience and current research. It is not medical advice. Always work with a qualified healthcare provider for your specific situation.*`

const HIGH_MD = `Your doctor flagged something. Maybe several things.

You were given a pamphlet and told to lose weight.

This is what they did not have time to explain.

---

### What This Is

Level 3 is where multiple systems are failing at once and feeding each other. This is not a single marker problem. It is a full metabolic syndrome picture.

By the end of this you will know three things. What is actually happening across those systems right now. Why the biology at this stage is serious and still reversible at the same time. And the exact path to start reversing it, step by step, beginning today.

The men who arrive at Level 3 are not the ones who stopped trying. They are the ones who kept trying with the wrong tools. Every failed attempt used a system that was never built for the biology they actually have. That is not a conclusion about you. It is a conclusion about the design.

---

### 01. What You Are Experiencing

At Level 3 the symptoms are not subtle and they are not occasional. They are the baseline. Most men at this stage have stopped noticing them, because they have been there long enough to feel like normal.

**Fatigue that is no longer an event, it is a state.** You are not tired after a hard week. You are tired as a default. Getting through the day takes effort that used to be automatic. This is what suppressed testosterone, high cortisol, and poor mitochondrial function produce when they run uncorrected long enough. 

**A diagnosis or a warning you have not fully acted on.** Type 2 diabetes. Prediabetes with a hard warning. Metabolic syndrome. A doctor who told you to lose weight and handed you a pamphlet. You know it is serious. The earlier attempts failed, and hope gets expensive after enough failures. The cost of hoping again starts to feel higher than the cost of staying stuck. That math is the most dangerous thing about this stage.

**Significant belly fat that has not responded to anything.** You have eaten less. You have moved more. The midsection stays. At Level 3 the fat around your organs has its own momentum. It secretes inflammatory signals that deepen insulin resistance, converts your testosterone into estrogen, and drives the cortisol problem that makes a steady calorie deficit feel impossible to hold. The deficit is the goal. The visceral fat is working to close it every day.

**Possibly already on medication with incomplete results.** Metformin. A statin. Blood pressure medication. A GLP-1. Each one handles a single downstream marker. None of them touch the upstream environment producing all the markers. They are the right tools for what they treat. They are incomplete without the system that makes the environment stop generating the problems in the first place.

**Joint pain and recovery that quietly gave up.** Inflammation at Level 3 is systemic. It shows up in joints that ache more than they should for your age, recovery that takes longer than it used to, and a sense of physical fragility that was not there ten years ago. 

**The photo you cannot get out of your head.** A tag on Facebook. A shot at a family event. A reflection you caught without expecting it. The man in that image and the man you still picture yourself as are not matching.

---

### 02. What Is Happening Under The Surface

These are the markers that define full metabolic syndrome. At Level 3 you are not dealing with one number that is off. You are dealing with a cluster that is reinforcing itself. Ask for every one of these if you have not had them run recently.

| Marker | Optimal | What we don't want to see |
|---|---|---|
| Fasting Glucose | 70 to 85 mg/dL | 126 mg/dL or above (type 2 threshold) |
| Hemoglobin A1C | Below 5.3% | 6.5% or above (diabetic range) |
| Fasting Insulin | Below 8 uIU/mL | 25+ uIU/mL (severe resistance) |
| Total Testosterone | 550 to 800 ng/dL | Below 300 ng/dL (clinically low) |
| Triglycerides | Below 100 mg/dL | 200 mg/dL or above (significantly high) |
| HDL Cholesterol | Above 55 mg/dL | Below 40 mg/dL (critically low) |
| hsCRP (Inflammation) | Below 0.5 mg/L | Above 3.0 mg/L (high inflammation) |
| Blood Pressure | Below 120/80 | 130/85 or above (hypertensive) |
| Liver Enzymes (ALT) | Below 25 U/L | Above 55 U/L (fatty liver likely) |

**This is metabolic syndrome, not a single problem.** Metabolic syndrome is defined as three or more of these: high fasting glucose, high triglycerides, low HDL, high blood pressure, and a large waist. Most men at Level 3 meet all five. It is not treated by fixing one marker. It is reversed by changing the upstream environment producing all five at once.

---

### 03. Why The Window Matters

**Cardiovascular risk is compounding every year.** Metabolic syndrome at this stage is one of the strongest predictors of a cardiovascular event in the next ten years. High triglycerides, low HDL, high blood pressure, and chronic inflammation do not just add together. They multiply each other. 

**Insulin resistance at this level is reaching your brain.** The link between insulin resistance and cognitive decline is documented well enough that Alzheimer's is being studied under the name type 3 diabetes in the research. The brain fog, the slow processing, the memory gaps you have been blaming on stress or age are not separate from the metabolic picture. They are produced by it. Reversing insulin resistance reverses that impairment at this stage.

**Testosterone below 300 is shutting down your recovery from everything.** Not just the gym. Recovery from work stress, from poor sleep, from a hard week, from any demand your body meets.

**The biology is still responsive, but the window has a timeline.** Level 3 is reversible. Men with full metabolic syndrome reverse it with the right intervention. What changes as time passes is how much work the reversal takes and how many secondary consequences pile up in the meantime. The window is open. It does not stay open forever.

**Every previous attempt was the right effort with the wrong tools.** You want to make a change, but every attempt before was run with generic advice, not built for you. And a few weeks in, you lost motivation and decided to give up. Running my MROI method with the right support makes all the difference.

---

### 04. What Reversal Looks Like

The fatigue lifts. Getting through the day stops taking everything you have. The energy that used to be automatic comes back, not as a good day, but as a default.

The markers move, and they move in the direction your doctor has been asking for. The glucose comes down. The A1C drops. The triglycerides fall. The blood pressure eases. The same panel that scared you starts to read like a man who is getting out.

Your head clears. The fog you blamed on age lifts as the insulin resistance reverses. The sharpness comes back.

Your recovery returns. The joints settle. You stop feeling fragile. Your body starts rebuilding from effort instead of breaking down under it.

And the photo stops being a thing you avoid. The man in the mirror starts matching the man you still are underneath all of this. That man was never gone. He got buried. This is the process that digs him out.

That is the outcome. The next section is how you start today.

---

### 05. The Path Forward, Step By Step

At Level 3 the work has to hit several systems at once, because each broken system is making the others worse. You do not need more effort. You need the right inputs in the right order. Start here.

**1. Lock the foundation first, no exceptions.** Steps, protein, training, sleep. At this stage these four are the most powerful metabolic intervention you can run without a prescription. Protein protects muscle and steadies blood sugar. Steps improve insulin sensitivity and burn real calories without raising cortisol. Training keeps the muscle that keeps your metabolism running. Sleep is where testosterone is made and cortisol is regulated. Everything else depends on these being consistent first.

**2. Anchor your protein.** One gram of protein per pound of your target bodyweight, every day. It is the one input that holds hunger down, protects your muscle while the fat comes off, and steadies your blood sugar better than anything else on the plate. Hit this before anything fancy.

**3. Stabilize blood sugar with food order.** Never eat carbs alone. Protein and vegetables first, carbs last. Stop drinking your sugar. This flattens the glucose spike and the crash that drives the cortisol and the cravings under your whole day. With severe insulin resistance, this single habit changes how the entire day feels.

**4. Set a hard movement floor.** Walk 10,000 steps a day and lift three times a week. Steps pull glucose out of your blood and improve insulin sensitivity directly. Lifting protects the muscle you cannot afford to lose while you drop fat. Three sessions is enough. If your joints hurt, start with what they allow and build from there.

**5. Attack sleep as a hormonal fix.** Sunlight in your eyes within thirty minutes of waking. No caffeine after 2pm. A real wind down with no screens for the last hour. Cool, dark room. Same wake time every day. At this stage, fixing sleep is how you raise testosterone and lower cortisol at the same time. It is not optional here.

**6. Lower your inflammatory load.** Get protein, vegetables, and omega 3 in daily. Lowering inflammation eases the insulin resistance, the joint pain, and the testosterone suppression at the same time, because they all share the same fire.

**7. Run the safe foundation supplements, and clear the rest with your doctor.** Creatine, five grams a day, for muscle and cognition. Magnesium glycinate in the evening for cortisol and sleep. Omega 3 with meals for inflammation. Vitamin D, tested, for testosterone support. These four are safe and corrective. Important: if you are on metformin, a GLP-1, insulin, or any blood pressure or glucose medication, do not add glucose lowering supplements like berberine on your own. They can stack with your medication and drop you too low. Run anything new past your doctor first.

**8. Use your medication as the unlock, not the system.** If you are on a GLP-1, metformin, a statin, or blood pressure medication, keep taking it exactly as prescribed. What it cannot do is build the habits that make the result hold when the medication changes. The foundation above is what you own when the dose comes down. Never start, stop, or adjust a medication on your own.

Do these in order. Foundation, protein, and blood sugar first. Sleep, inflammation, and supplements next. Your medication stays exactly as your doctor set it. Simple done every day beats perfect done once in a while, every single time.

A note on the advanced tools. Peptides for recovery and growth hormone, and the higher level testosterone conversation, are real, but they sit on top of a foundation that is already working. They are not where you start, and they are not a substitute for the steps above. Often the testosterone number itself climbs once the visceral fat, the sleep, and the cortisol are corrected, before any of that is even on the table.

---

### A Note On The Medications You May Already Be Taking

Each of these does something real. None of them does the whole job alone.

| Medication | What It Does | What It Cannot Do Alone |
|---|---|---|
| **Metformin** | Lowers liver glucose output, improves insulin sensitivity | Build the system that makes the effect permanent |
| **GLP-1 / GIP** | Suppresses appetite, slows gastric emptying, improves glucose | Build the habits that hold when the medication changes |
| **Statin** | Lowers LDL and cardiovascular inflammatory markers | Fix the upstream diet and metabolic inputs driving the lipids |
| **BP Medication** | Manages blood pressure at the symptom level | Correct the cortisol and insulin environment causing the rise |

The medication is not the problem. The gap between what the medication does and what a full reversal requires is the problem. Closing that gap is exactly what a system built around your specific biology, schedule, and history is for.

---

### The Chainmover Guarantee

**50 lbs. Guaranteed.**

When you join the Codex, you lose 50 lbs of fat or I coach you for free until you do. 

If you are at Level 3, you do not need more pressure. You need a system built for the biology you actually have, run by the person who solved the same problem from the inside. Every client works directly with me. No handoffs. No sub coaches. No AI. The guarantee exists because I do not take clients I cannot help.

---

You now know what is happening, why the window is open but timed, and the exact path to start reversing it.

The next step is seeing how the full system fits together from start to finish.

**Watch the step by step overview: ${OVERVIEW_URL}**

@luke.strassner.fit

*Chainmover Fitness. Luke Strassner. This document is for educational purposes based on lived experience and current research. It is not medical advice. Always work with a qualified healthcare provider for your specific situation.*`

/* ─── exports ──────────────────────────────────────────────────────── */
export function EarlyWarningPage() {
  return <DocPage meta={{ level: 'Level 1', tag: 'Early Warning', name: 'The Early Warning Stage', accent: '#f59e0b', accentSoft: 'rgba(245,158,11,0.12)', intro: "Your labs look fine. Your doctor isn't worried yet. That is exactly what makes this stage the most dangerous one.", md: EARLY_MD }} />
}

export function MetabolicStressPage() {
  return <DocPage meta={{ level: 'Level 2', tag: 'Active Dysfunction', name: 'Active Dysfunction', accent: '#f97316', accentSoft: 'rgba(249,115,22,0.12)', intro: 'Your labs may still be called borderline. Your body stopped being borderline a while ago.', md: STRESS_MD }} />
}

export function HighRiskPage() {
  return <DocPage meta={{ level: 'Level 3', tag: 'The Window Is Closing', name: 'The Window Is Closing', accent: '#ef4444', accentSoft: 'rgba(239,68,68,0.12)', intro: 'Your doctor flagged something. Maybe several things. You were given a pamphlet and told to lose weight. This is what they did not have time to explain.', md: HIGH_MD }} />
}
