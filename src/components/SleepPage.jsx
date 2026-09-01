import Link from 'next/link'
import YouTubeThumb from './YouTubeThumb'
import chainmoverLogoImg from '../assets/ChainmoverLogo.png'

const chainmoverLogo = chainmoverLogoImg.src

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


/* ─── shared paragraph style ───────────────────────────────────────── */
const P = { fontSize: 17, lineHeight: 1.75, color: T.inkSoft, margin: '0 0 18px' }
const H2 = { fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(24px,3.2vw,34px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: T.ink, margin: '48px 0 20px' }

/* ─── the "do this tonight" card that closes each of the three ─────── */
function Tonight({ items }) {
  return (
    <div style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 14, padding: '22px 24px', margin: '4px 0 8px' }}>
      <span style={{ fontFamily: T.mono, fontSize: 11.5, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'block', marginBottom: 14 }}>
        Do this tonight
      </span>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((it) => (
          <li key={it} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
              <circle cx="12" cy="12" r="10" fill={T.vitalSoft} />
              <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke={T.forest} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 16, lineHeight: 1.65, color: T.ink }}>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── the numbered heading that opens each of the three ────────────── */
function Cause({ n, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '52px 0 18px' }}>
      <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: T.forest, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: T.display, fontWeight: 800, fontSize: 18 }}>
        {n}
      </span>
      <div>
        <span style={{ fontFamily: T.mono, fontSize: 11.5, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'block', marginBottom: 4 }}>{label}</span>
        <h2 style={{ ...H2, margin: 0 }}>{children}</h2>
      </div>
    </div>
  )
}

export default function SleepPage() {

  return (
    <div style={{ background: T.paper, minHeight: '100svh', fontFamily: T.body, color: T.ink, display: 'flex', flexDirection: 'column' }}>

      {/* header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={chainmoverLogo} alt="" style={{ height: 34, width: 'auto', objectFit: 'contain', display: 'block' }} />
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: T.ink, whiteSpace: 'nowrap' }}>Chainmover Coaching</span>
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', paddingBlock: 'clamp(40px,6vw,72px)' }}>

        {/* hero */}
        <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'block', marginBottom: 16 }}>
          Sleep and metabolic health
        </span>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
          Eight hours in bed. Still exhausted.
        </h1>
        <p style={{ marginTop: 18, fontSize: 'clamp(17px,1.7vw,20px)', lineHeight: 1.55, color: T.inkSoft, fontWeight: 500 }}>
          Three reasons your body never actually recovered last night, and what to do about each one before bed tonight.
        </p>

        {/* intro */}
        <h2 style={H2}>Hours in bed are not the same as sleep</h2>
        <p style={P}>You are doing the thing everyone tells you to do. You are in bed for eight hours. And you still wake up foggy, still need the coffee before you can hold a conversation, still hit a wall in the afternoon and go looking for sugar.</p>
        <p style={P}>That is not a willpower problem and it is not a schedule problem. It is a recovery problem. Something is interrupting the deep, restorative part of your sleep, and you never feel it happen, because the whole point is that you stay asleep through it.</p>
        <p style={P}>In my experience there are three usual suspects. Most people reading this have at least two of them.</p>

        {/* ── 1. sleep apnea ── */}
        <Cause n="1" label="The one you snore through">Your airway is closing while you sleep</Cause>
        <p style={P}>When you fall asleep, the muscles around your throat relax. If that airway is already crowded, it narrows or collapses shut. Your breathing stops for a few seconds. Your brain notices the oxygen drop, panics, and jolts you just far enough toward waking to reopen it. You gasp, or snore, or shift, and you go back under with no memory of any of it.</p>
        <p style={P}>Then it happens again. In moderate cases, dozens of times an hour, all night. You are technically in bed for eight hours and never spend meaningful time in deep sleep.</p>
        <p style={P}>Worth knowing, because it gets missed constantly: this is not only a loud-snoring, large-man condition. In women it often shows up as fatigue, insomnia, morning headaches, anxiety or low mood rather than the classic thunderous snore, which is a large part of why women go undiagnosed for years. Risk also climbs after menopause. If you have been told you are just tired or just stressed, and nobody has ever asked about your breathing, that is a gap worth closing.</p>
        <Tonight items={[
          'Sleep on your side, not your back. On your back, the tongue and soft tissue fall backward and close the airway faster. A firm pillow wedged behind you stops you rolling over.',
          'Raise the head of the bed 4 to 6 inches. Books under the legs, or a wedge. Gravity helps hold the airway open and keeps stomach acid down. Stacking pillows is a distant second, it mostly just bends your neck.',
          'Ask your doctor for a sleep study if any of this sounds like you. This is the one item here that needs a real diagnosis, and home tests have made it far easier than it used to be.',
        ]} />

        {/* ── 2. cortisol inversion ── */}
        <Cause n="2" label="The 2am wake-up">Your cortisol rhythm has flipped</Cause>
        <p style={P}>Cortisol is supposed to run on a curve. Lowest around midnight, climbing through the early hours, peaking shortly after you wake so you get up with energy. When that curve inverts, you get the opposite: wired at 11pm, then wide awake at 2 or 3am, heart going, mind switched on, staring at the ceiling for an hour.</p>
        <p style={P}>A common driver is blood sugar. If you go to bed with your blood sugar propped up and it drops steeply overnight, your body treats that dip as an emergency and releases cortisol and adrenaline to push it back up. Those are the same hormones designed to wake you. So you wake, and you wake alert, which is the tell. Genuine insomnia usually feels tired-but-unable-to-sleep. This feels like someone flipped a switch.</p>
        <p style={P}>Chronic stress flattens and shifts the same curve over time. And for women in perimenopause, falling progesterone removes one of the body's own sleep-supporting signals, which is why night waking so often starts in that window even when nothing else has changed.</p>
        <Tonight items={[
          'Eat a real dinner with protein and some carbohydrate. Going to bed underfed is one of the most reliable ways to buy yourself a 2am wake-up.',
          'Get outside within 30 minutes of waking. Morning light is the strongest lever you have for putting the cortisol peak back where it belongs.',
          'If you do wake, keep the lights off and stay horizontal. Reaching for your phone tells your brain the day has started and locks the pattern in for tomorrow.',
        ]} />

        {/* ── 3. alcohol ── */}
        <Cause n="3" label="The one that feels like it helps">Alcohol is sedation, not sleep</Cause>
        <p style={P}>Alcohol does put you under faster. That part is real, and it is why so many people use it. What it does after that is the problem.</p>
        <p style={P}>It suppresses REM sleep in the first half of the night. Then, as your body clears it, you get a rebound: lighter sleep, more waking, often around, yes, 2 or 3am. That is the same window as the cortisol wake-up, and if you are doing both, they stack.</p>
        <p style={P}>It also relaxes the muscles of the throat more than normal sleep does, so it makes airway collapse worse. If cause one applies to you, a couple of drinks turns a mild night into a bad one. And for the same drink, women generally reach a higher blood alcohol concentration than men do, so "only two glasses of wine" is not the same dose across the room.</p>
        <Tonight items={[
          'Nothing within 3 hours of bed. If you are drinking, drink earlier, so your body has cleared most of it before you lie down.',
          'Match every drink with a glass of water. Dehydration is a share of the 3am wake and the morning headache.',
          'Take two consecutive nights off and pay attention to how you feel on the third morning. One night is noise. Two is a signal you can actually read.',
        ]} />

        {/* the loop */}
        <h2 style={H2}>Why this keeps getting worse on its own</h2>
        <p style={P}>These three are not separate problems sitting next to each other. They feed each other, and they all feed your metabolism.</p>
        <p style={P}>Short, broken sleep raises cortisol and pushes your body toward insulin resistance. Insulin resistance makes it easier to store fat and harder to release it. Added weight around the neck and midsection crowds the airway further, which makes the apnea worse, which shortens the sleep further. Every year the loop gets a little tighter, and the effort required to break it goes up.</p>
        <p style={P}>This is also not only about being tired. Untreated sleep apnea is associated with high blood pressure, heart disease and stroke. It is a health problem with a clock on it, not a snoring inconvenience.</p>
        <p style={P}>The steps above buy you a better night. What actually breaks the loop is fixing the metabolism underneath it, in that order, rather than starving yourself for six weeks and handing it all back.</p>
        <p style={P}>That is what I built the MROI Method to do. The short video below walks through why the weight came on, why a normal diet will not take it off, and the sequence that reverses it.</p>
        <p style={{ ...P, fontWeight: 600, color: T.ink }}>Watch it now while this is fresh.</p>

        {/* video (deep link out to YouTube) */}
        <a href={PLAN_VIDEO_URL} target="_blank" rel="noreferrer" aria-label="Watch the video on YouTube"
          style={{ display: 'block', position: 'relative', marginTop: 8, borderRadius: 16, overflow: 'hidden', aspectRatio: '16 / 9', background: '#000', boxShadow: T.shadow, border: `1px solid ${T.line}` }}>
          <YouTubeThumb videoId={PLAN_VIDEO_ID} alt="Watch the video" />
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
          This is not medical advice, and nothing here diagnoses a condition. Sleep apnea is serious and is diagnosed with a sleep study, not from a page like this one. Persistent night waking can also have causes worth ruling out with a doctor, including thyroid, hormonal and medication effects. Keep working with your physician, and if you use a CPAP, keep using it. These steps stack on top of your care, they do not replace it.
        </p>
      </main>

      {/* footer */}
      <footer style={{ background: T.ink, color: '#fff', paddingBlock: 40, marginTop: 64 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.display, fontWeight: 800, fontSize: 18 }}>
            Chainmover Coaching
          </div>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>Luke Strassner, Head Coach</span>
        </div>
      </footer>
    </div>
  )
}
