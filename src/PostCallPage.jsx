import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import chainmoversLogo from './assets/CHAINMOVERSLOGOV1 (2).png'

/* ─── EMBED — paste your Loom share ID here ─────────────────────────
   From a Loom URL like https://www.loom.com/share/abc123def456
   the ID is the part after /share/  →  'abc123def456'       
   https://www.loom.com/share/2d7655a47aa846ec86a08d2efeb8a507         */
const LOOM_ID = '2d7655a47aa846ec86a08d2efeb8a507'

/* "How we'll get you 50+ lbs down" — walkthrough of the four phases +
   who it's for vs not for. Paste that Loom share ID here.            */
const METHOD_LOOM_ID = '81fcce235f974efaa6fe4c3920df79cb'

/* ─── YouTube VSL — the main overview video ─────────────────────────
   From a URL like https://youtu.be/ceAIiqaK_Kc the ID is 'ceAIiqaK_Kc'. */
const YOUTUBE_VSL_ID = 'ceAIiqaK_Kc'

/* Strips the Loom chrome — top bar, title, owner, share, and the view
   count — so the embed shows just the player. */
const LOOM_PARAMS = 'hideEmbedTopBar=true&hide_owner=true&hide_title=true&hide_share=true'

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

const PAGE_CSS = `
  .pc-faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between;
    align-items: center; padding: 22px 0; font-family: ${T.display}; font-weight: 600; font-size: 17px;
    color: ${T.ink}; border-top: 1px solid ${T.line}; user-select: none; gap: 16px; }
  .pc-faq summary::-webkit-details-marker { display: none; }
  .pc-faq summary .ic::after { content: "+"; font-size: 22px; font-weight: 400; color: ${T.moss}; transition: transform .25s; display: inline-block; }
  .pc-faq[open] summary .ic::after { transform: rotate(45deg); }
  .pc-faq .a { padding: 0 0 22px; font-size: 16px; color: ${T.inkSoft}; line-height: 1.65; }
  @media (max-width: 760px) {
    .pc-expect { grid-template-columns: 1fr !important; }
    .pc-results { grid-template-columns: 1fr !important; max-width: 460px; margin-inline: auto; }
    .pc-videos { grid-template-columns: 1fr !important; max-width: 360px; margin-inline: auto; }
    .pc-quotes { grid-template-columns: 1fr !important; }
  }
`

/* ─── content ──────────────────────────────────────────────────────── */
const EXPECT = [
  { n: '01', title: 'Diagnostic', body: "We start with where you actually are right now — your current situation, the pains, the day-to-day struggles. Honest picture, no judgment." },
  { n: '02', title: 'Desired', body: "Then where you want to be. Your real goals, what life looks like on the other side, and what actually matters to you about getting there." },
  { n: '03', title: 'Roadblocks', body: "What's stood in the way. Everything you've tried, what failed, and why — so we can pinpoint what's actually been holding the result back." },
  { n: '04', title: 'Next Steps', body: "We walk through exactly what moving forward looks like. If it's a fit, you'll know how to start. If it's not, no issue — you'll still leave with a clear direction." },
]

// const WINS = [
//   { name: 'Tim', duration: '9 months', stats: [['-71', 'lbs', 'Weight'], ['6.9→5.4', '', 'A1C'], ['Off', '', 'BP meds']], quote: '"I almost didn\'t book the call. I\'d failed at this so many times I figured it\'d be another sales pitch. It wasn\'t. He told me exactly what was wrong and why nothing had worked."' },
//   { name: 'Dave, 52', duration: '7 months', stats: [['-58', 'lbs', 'Weight'], ['+2', 'hrs', 'Sleep'], ['-4', 'in', 'Waist']], quote: '"I was skeptical a call would do anything. Twenty minutes in I understood my own body better than after years of doctor visits. That\'s when I knew."' },
//   { name: 'Carlos, 41', duration: '11 months', stats: [['-83', 'lbs', 'Weight'], ['Normal', '', 'Labs'], ['-5', 'in', 'Waist']], quote: '"Same guy on the call as the guy coaching me every week since. No handoff to some assistant. That mattered more than I expected."' },
// ]

/* ─── written testimonials ─────────────────────────────────────────── */
const QUOTES = [
  { name: 'Daniel', stat: 'Down 85 lbs', quote: "Two months in, people are noticing. I get compliments from family, coworkers, friends. I really can't recall the last time I felt this confident. It's amazing." },
  { name: 'Larry', stat: 'Down 40 lbs in 5 months', quote: "Other coaches felt like I was being handed off to a guy in Ecuador. It didn't feel the same. With Luke I actually get Luke. If I don't have enough communication, it doesn't work for me, and this works." },
  { name: 'Sascha', stat: 'Entrepreneur, Father', quote: "In my business it's man to man. What I look like on the outside is what people presume about how my business is run. This is the first time in years the scale is actually going the right way. I broke 230 for the first time in years, in the first couple of weeks. Nutrition wise I'm dialed in and the weight is moving." },
  { name: 'Wyatt', stat: 'Doctor of Chiropractic Medicine', quote: "You're not just doing a little bit of exercise and a little bit of nutrition. You're getting down to the minutiae of it. That's what actually makes me think you know what you're doing." },
  { name: 'Gabe', stat: 'Down 25 lbs in 3 months', quote: "The biggest difference in the program is probably my mental health. My clothes fit better, I have better energy. Not only do I have more confidence, but I finally feel like 'yeah, I can do this.' It's not just a pipe dream anymore." },
]

const FAQS = [
  { q: "I've tried programs before and they didn't work. Why would this be different?", a: "Because most programs give generic fixes. We fix the order of operations: metabolism and recovery first, so by the time you'd normally plateau or stall, your body is working with you instead of against you. Your past failures were almost always a structure and support problem." },
  { q: "Is this just going to be a high-pressure sales call?", a: "No. I only take men I'm confident I can deliver the 50 lb guarantee for, so the call is genuinely about figuring out whether that's you. If it's not a fit, I'll tell you, and you'll still leave with a clear direction. There's no upside for either of us in forcing something that won't work. Logically, it wouldn't make sense for me to pressure men into joining because if we're not both confident in moving forward, chances are we're not a good fit, and adherence to the program wouldn't be great, which negatively reflects on me and my business. Word gets around." },
    { q: "How much does the coaching cost?", a: "We'll talk specifics on the call once I understand your situation, because the right structure depends on where you're starting. What I can tell you now: it's high-touch 1-on-1 coaching directly with me, backed by the guarantee that you lose 50 lbs or I work for free until you do. The risk sits with me. My 12 month program (the one the guarantee is for) is cheaper when paid up front compared to monthly. That being said, my pricing is quite standard for the industry." },
  { q: "I'm busy. How much time does this actually take?", a: "It's built around a working man's schedule — a few focused training sessions and simple daily habits, not hours in the gym. The 1-on-1 structure means the plan bends to your life, not the other way around. We'll map it to your actual week on the call." },
  { q: "What if my labs are already bad or I'm on medication?", a: "That's exactly who this is built for. Pre-diabetic, high blood pressure, low testosterone, already on metformin or a GLP-1 — we work with your doctor, not around them, and build the system underneath the medication so the result holds. Bring your latest labs to the call if you have them." },
  { q: "What do I need to do before the call?", a: "Nothing complicated. Watch the software demo above so you can see how the day-to-day actually works, and pull up your most recent bloodwork if you have it. Show up honest about what's been going on. That's it." },
  { q: "Do you offer refunds?", a: "On a case by case basis. Typically, if you're wanting a refund, it's not working out well for both of us — and I value my time and energy more than keeping money from a client that isn't cooperating." },
  { q: "How long does the program last?", a: "The program is designed to be a 12-month commitment, which gives us enough time to build the habits and systems that will support your long-term success. The guarantee is tied to this 12-month period." },
  { q: "How long will it take for me to lose the first 50 lbs?", a: "The timeline varies by individual, but most men see the first 50 lbs lost within 5-10 months. The key is following the system we'll build together." }
]

/* ─── video testimonials — paste each Loom share ID below ────────────
   From https://www.loom.com/share/abc123  →  the ID is 'abc123'.       */
const VIDEO_TESTIMONIALS = [
  { loomId: 'a316d667a37a47459297c37290742260', name: 'Testimonial 1' },
  { loomId: '700a1f79caeb4f7fa712c03e8686aeeb', name: 'Testimonial 2' },
  { loomId: '18919208d0a14a59beb50f448ffca7f1', name: 'Testimonial 3' },
]

/* ─── header ───────────────────────────────────────────────────────── */
function PageHeader() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.85)', backdropFilter: 'saturate(180%) blur(14px)', borderBottom: `1px solid ${T.lineSoft}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={chainmoversLogo} alt="Chainmover Fitness" style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }} />
        </Link>
        <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: T.moss }}>Call Confirmed</span>
      </div>
    </header>
  )
}

/* ─── page ─────────────────────────────────────────────────────────── */
export default function PostCallPage() {
  useFonts()
  const wrap = { maxWidth: 880, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)' }

  return (
    <div style={{ background: T.paper, minHeight: '100svh', fontFamily: T.body, color: T.ink }}>
      <style>{PAGE_CSS}</style>
      <PageHeader />

      {/* ── Hero / confirmation ── */}
      <section style={{ background: `radial-gradient(120% 120% at 85% -10%, ${T.mist} 0%, rgba(232,241,234,0) 55%), ${T.paper}` }}>
        <div style={{ ...wrap, paddingBlock: 'clamp(48px,7vw,88px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: T.vitalSoft, color: T.forest, fontFamily: T.mono, fontSize: 12, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: 100, marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.vital, display: 'inline-block' }} />
            Your call is booked
          </div>
          <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(34px,5.5vw,58px)', lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0, maxWidth: 760 }}>
            Wait---your call isn't confirmed yet.
          </h1>
          <p style={{ marginTop: 22, fontSize: 'clamp(17px,1.6vw,21px)', lineHeight: 1.6, color: T.inkSoft, maxWidth: 640 }}>
            Before we talk, take time with everything below — it's the difference between a good call and a great one. Watch the videos below to get a better understanding of what to expect. Further instructions will be given so that your call can be confirmed, make sure to fully read through the page.
          </p>
        </div>
      </section>

      {/* ── VSL: full overview ── */}
      <section style={{ ...wrap, paddingBlock: 'clamp(32px,4vw,56px)' }}>
        <span style={{ fontFamily: T.mono, fontSize: 12.5, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 22, height: 1.5, background: T.moss, display: 'inline-block' }} />Watch this first
        </span>
        <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,40px)', marginTop: 16, letterSpacing: '-0.02em' }}>
          How we get men 50+ lbs down
        </h2>
        <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.7, color: T.inkSoft, maxWidth: 620 }}>
          If you haven't seen the full overview yet, start here. It's the clearest picture of how the method actually works — watch it before we talk.
        </p>

        <div style={{ marginTop: 28, position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 16, overflow: 'hidden', boxShadow: T.shadowLg, border: `1px solid ${T.line}`, background: T.bone }}>
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_VSL_ID}`}
            title="How we get men 50+ lbs down"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />
        </div>
      </section>

      {/* ── How we'll get you 50+ lbs down ── */}
      <section style={{ ...wrap, paddingBlock: 'clamp(32px,4vw,56px)' }}>
        <span style={{ fontFamily: T.mono, fontSize: 12.5, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 22, height: 1.5, background: T.moss, display: 'inline-block' }} />Before the call
        </span>
        <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,40px)', marginTop: 16, letterSpacing: '-0.02em' }}>
          How to prepare for the call
        </h2>
        <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.7, color: T.inkSoft, maxWidth: 620 }}>
          Then watch this so we get the most out of our call.
        </p>

        <div style={{ marginTop: 28, position: 'relative', paddingBottom: '62.5%', height: 0, borderRadius: 16, overflow: 'hidden', boxShadow: T.shadowLg, border: `1px solid ${T.line}`, background: T.bone }}>
          {METHOD_LOOM_ID === 'PASTE_METHOD_LOOM_ID_HERE' ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: T.inkFaint, fontFamily: T.mono, fontSize: 13, textAlign: 'center', padding: 24 }}>
              <span style={{ fontSize: 15, color: T.inkSoft, fontWeight: 600 }}>Loom embed placeholder</span>
              <span>Paste your Loom share ID into METHOD_LOOM_ID at the top of PostCallPage.jsx</span>
            </div>
          ) : (
            <iframe
              src={`https://www.loom.com/embed/${METHOD_LOOM_ID}?${LOOM_PARAMS}`}
              title="How we'll get you 50+ lbs down"
              frameBorder="0"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          )}
        </div>
      </section>

      {/* ── Loom software demo ── */}
      <section style={{ ...wrap, paddingTop: 0, paddingBottom: 'clamp(32px,4vw,56px)' }}>
        <span style={{ fontFamily: T.mono, fontSize: 12.5, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 22, height: 1.5, background: T.moss, display: 'inline-block' }} />Then watch this
        </span>
        <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,40px)', marginTop: 16, letterSpacing: '-0.02em' }}>
          See exactly how the coaching works
        </h2>
        <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.7, color: T.inkSoft, maxWidth: 620 }}>
          A quick walkthrough of the software you'll use day to day — how check-ins, your plan, and direct access to me actually run. Watch this before the call so we can spend our time on you, not the logistics.
        </p>

        <div style={{ marginTop: 28, position: 'relative', paddingBottom: '62.5%', height: 0, borderRadius: 16, overflow: 'hidden', boxShadow: T.shadowLg, border: `1px solid ${T.line}`, background: T.bone }}>
          {LOOM_ID === 'PASTE_LOOM_ID_HERE' ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: T.inkFaint, fontFamily: T.mono, fontSize: 13, textAlign: 'center', padding: 24 }}>
              <span style={{ fontSize: 15, color: T.inkSoft, fontWeight: 600 }}>Loom embed placeholder</span>
              <span>Paste your Loom share ID into LOOM_ID at the top of PostCallPage.jsx</span>
            </div>
          ) : (
            <iframe
              src={`https://www.loom.com/embed/${LOOM_ID}?${LOOM_PARAMS}`}
              title="Software demonstration"
              frameBorder="0"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          )}
        </div>
      </section>

      {/* ── What to expect ── */}
      <section style={{ background: T.bone, paddingBlock: 'clamp(56px,7vw,96px)' }}>
        <div style={wrap}>
          <span style={{ fontFamily: T.mono, fontSize: 12.5, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 22, height: 1.5, background: T.moss, display: 'inline-block' }} />What to expect
          </span>
          <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,40px)', marginTop: 16, letterSpacing: '-0.02em' }}>
            What actually happens on the call
          </h2>
          <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.7, color: T.inkSoft, maxWidth: 620 }}>
            No script. No pressure. Here's the shape of the conversation so you know what you're walking into.
          </p>
          <div className="pc-expect" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 40 }}>
            {EXPECT.map(e => (
              <div key={e.n} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: '28px 26px' }}>
                <div style={{ fontFamily: T.mono, fontSize: 12, color: T.vital, letterSpacing: '.1em', fontWeight: 500 }}>{e.n}</div>
                <h3 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 20, marginTop: 10 }}>{e.title}</h3>
                <p style={{ marginTop: 10, fontSize: 15.5, lineHeight: 1.6, color: T.inkSoft }}>{e.body}</p>
              </div>
            ))}
          </div>

          {/* come-prepared callout */}
          <div style={{ marginTop: 28, background: T.forest, color: '#fff', borderRadius: 16, padding: 'clamp(26px,4vw,40px)', display: 'flex', gap: 20, alignItems: 'flex-start', boxShadow: T.shadow }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(70,201,139,.18)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={T.vital} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(20px,2.4vw,26px)', color: '#fff' }}>
                Come ready to make a decision.
              </h3>
              <p style={{ marginTop: 12, fontSize: 16.5, lineHeight: 1.7, color: 'rgba(255,255,255,.82)' }}>
                By the end of the call you'll have everything you need to know whether this is right for you. So show up in a place where you can give a real yes or a real no. "Let me think about it" usually just means we didn't get you the clarity you needed, and I'd rather get you that on the call than leave you stuck. Either answer is welcome. An honest one is all I ask.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ ...wrap, paddingBlock: 'clamp(56px,7vw,96px)' }}>
        <span style={{ fontFamily: T.mono, fontSize: 12.5, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 22, height: 1.5, background: T.moss, display: 'inline-block' }} />Men like you
        </span>
        <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,40px)', marginTop: 16, letterSpacing: '-0.02em' }}>
          Guys who sat where you're sitting
        </h2>
        <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.7, color: T.inkSoft, maxWidth: 620 }}>
          Same doubts. Same failed attempts. Here's what happened after they showed up to the call.
        </p>
        <div className="pc-quotes" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 40 }}>
          {QUOTES.map(q => (
            <blockquote key={q.name} style={{ margin: 0, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: 'clamp(24px,3.5vw,32px)', boxShadow: T.shadow, display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(18px,2vw,22px)', lineHeight: 1.45, color: T.ink, letterSpacing: '-0.01em' }}>“{q.quote}”</p>
              <footer style={{ marginTop: 'auto', paddingTop: 18, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <b style={{ fontFamily: T.display, fontSize: 16, color: T.ink }}>{q.name}</b>
                <span style={{ fontFamily: T.mono, fontSize: 12.5, color: T.moss }}>{q.stat}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        {/* <div className="pc-results" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 40 }}>
          {WINS.map(w => (
            <article key={w.name} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden', boxShadow: T.shadow }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: T.line, position: 'relative', minHeight: 200 }}>
                <div style={{ background: T.mist, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 11, color: T.inkFaint, letterSpacing: '.08em', textTransform: 'uppercase', minHeight: 180 }}>Before</div>
                <div style={{ background: T.bone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 11, color: T.inkFaint, letterSpacing: '.08em', textTransform: 'uppercase' }}>After</div>
                <span style={{ position: 'absolute', top: 12, left: 12, fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: 'rgba(17,36,27,.72)', color: '#fff', padding: '4px 9px', borderRadius: 100 }}>Before</span>
                <span style={{ position: 'absolute', top: 12, right: 12, fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: T.vital, color: T.forest, padding: '4px 9px', borderRadius: 100 }}>After</span>
              </div>
              <div style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <b style={{ fontFamily: T.display, fontSize: 17 }}>{w.name}</b>
                  <span style={{ fontFamily: T.mono, fontSize: 12, color: T.inkFaint }}>{w.duration}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  {w.stats.map(([val, unit, label]) => (
                    <div key={label} style={{ flex: 1, background: T.bone, borderRadius: 10, padding: 12, textAlign: 'center' }}>
                      <b style={{ display: 'block', fontFamily: T.display, fontWeight: 800, fontSize: 20, color: T.forest, letterSpacing: '-0.02em' }}>
                        {val}<em style={{ fontStyle: 'normal', fontSize: 12, color: T.inkFaint, fontWeight: 600 }}>{unit}</em>
                      </b>
                      <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: T.inkFaint }}>{label}</span>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: 16, fontSize: 14.5, color: T.inkSoft, lineHeight: 1.55, fontStyle: 'italic' }}>{w.quote}</p>
              </div>
            </article>
          ))}
        </div>
      </section> */}

      {/* ── Video testimonials (mp4) ── */}
      {/* <section style={{ background: T.bone, paddingBlock: 'clamp(56px,7vw,96px)' }}> */}
        <div style={wrap}>
          {/* <span style={{ fontFamily: T.mono, fontSize: 12.5, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 22, height: 1.5, background: T.moss, display: 'inline-block' }} />In their own words
          </span>
          <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,40px)', marginTop: 16, letterSpacing: '-0.02em' }}>
            Hear it straight from them
          </h2> */}
          <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.7, color: T.inkSoft, maxWidth: 620 }}>
            Short, unscripted clips from men who went through it.
          </p>
          <div className="pc-videos" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 40 }}>
            {VIDEO_TESTIMONIALS.map((v, i) => (
              <div key={i} style={{ background: '#000', border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden', boxShadow: T.shadow, aspectRatio: '9 / 16' }}>
                {v.loomId && !v.loomId.startsWith('PASTE_') ? (
                  <iframe
                    src={`https://www.loom.com/embed/${v.loomId}?${LOOM_PARAMS}`}
                    title={v.name}
                    frameBorder="0"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: T.mist, color: T.inkFaint, fontFamily: T.mono, fontSize: 12, textAlign: 'center', padding: 20 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={T.moss} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 30, height: 30 }}>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span style={{ fontWeight: 600, color: T.inkSoft }}>{v.name}</span>
                    <span>Paste a Loom ID in VIDEO_TESTIMONIALS</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ / objections ── */}
      <section style={{ background: T.paper, paddingBlock: 'clamp(56px,7vw,96px)' }}>
        <div style={wrap}>
          <span style={{ fontFamily: T.mono, fontSize: 12.5, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 22, height: 1.5, background: T.moss, display: 'inline-block' }} />FAQ
          </span>
          <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,40px)', marginTop: 16, letterSpacing: '-0.02em' }}>
            Questions you're probably having
          </h2>
          <div style={{ marginTop: 36 }}>
            {FAQS.map((f, i) => (
              <details key={i} className="pc-faq" open={i === 0}>
                <summary>{f.q}<span className="ic" /></summary>
                <div className="a">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Confirm attendance (final step to lock in the booking) ── */}
      <section style={{ ...wrap, paddingBlock: 'clamp(48px,6vw,88px)' }}>
        <div style={{ background: T.forest, color: '#fff', borderRadius: 18, padding: 'clamp(28px,4vw,48px)', boxShadow: T.shadow, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(70,201,139,.18)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={T.vital} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: T.vital }}>One last step</span>
            <h2 style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(22px,2.8vw,32px)', color: '#fff', margin: '12px 0 0', letterSpacing: '-0.02em' }}>
              Confirm your attendance to complete the booking.
            </h2>
            <p style={{ marginTop: 14, fontSize: 16.5, lineHeight: 1.7, color: 'rgba(255,255,255,.85)' }}>
              Your time isn't fully locked in until you confirm it. Check your email for the confirmation link and click it now to finalize your spot. Unconfirmed times are released so someone else can take them — so don't leave it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: T.ink, color: '#fff', paddingBlock: 40 }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
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
