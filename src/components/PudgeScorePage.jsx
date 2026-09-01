'use client'

import { useEffect, useRef, useState } from 'react'
import chainmoverLogoImg from '../assets/ChainmoverLogo.png'

const chainmoverLogo = chainmoverLogoImg.src

/* ══════════════════════════════════════════════════════════════════════
   /pudgescore — on-site AI body composition estimate.

   The whole thing runs on our own infrastructure: the photo is resized in
   the visitor's browser, sent to our Worker, analysed by Claude Haiku 4.5,
   and discarded. Nothing is stored, and the visitor never leaves the site.

   Flow is deliberately ordered so nothing costs a token until someone has
   committed an email: upload -> a short non-network "reading" beat -> the
   email gate -> only then the real call to Anthropic, with its own loading
   state, landing on the full result in one reveal. A visitor who bails at
   the gate never costs a cent; only a captured lead spends real money.
   ══════════════════════════════════════════════════════════════════════ */

const WORKER_URL = 'https://pudge-score.chainmover.workers.dev'

/* Resolved when a request is made, not at module load. This page is
   prerendered to static HTML at build time, where there is no window to
   read a hostname from. */
export function apiBase() {
  const h = window.location.hostname
  if (h === 'localhost' || h === '127.0.0.1') return 'http://127.0.0.1:8787' // wrangler dev
  return WORKER_URL
}

const MAX_EDGE = 1024 // longest edge after resize
const JPEG_QUALITY = 0.8
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // post-resize ceiling, matches the Worker
const MAX_SOURCE_BYTES = 30 * 1024 * 1024 // refuse to even decode past this

/* The fake "reading" beat between upload and the gate. Purely cosmetic — no
   network call happens here. Long enough to feel like something happened,
   short enough not to feel like a stall. */
const FAKE_READ_MS = 1200

/* Shown in sequence while the call is in flight. The wait is 3-8s and a
   status that never changes reads as though it has hung. */
const LOADING_STEPS = [
  'Reading the image…',
  'Checking definition…',
  'Assessing fat distribution…',
  'Writing your read-out…',
]

const APPLY_URL = 'https://lukestrassner.com/apply/?src=pudgescore'

/* ─── brand tokens (match the rest of the site) ────────────────────── */
const T = {
  forest: '#143D2B',
  forest600: '#246048',
  moss: '#3A7D5C',
  vital: '#46C98B',
  vitalSoft: '#C9EBD8',
  ink: '#11241B',
  inkSoft: '#46554D',
  inkFaint: '#748178',
  paper: '#FFFFFF',
  bone: '#F3F7F3',
  mist: '#E8F1EA',
  line: '#DBE5DC',
  lineSoft: '#EAF0EA',
  danger: '#C4453A',
  display: '"Archivo","Helvetica Neue",Arial,sans-serif',
  body: '"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',
  mono: '"IBM Plex Mono",ui-monospace,"SFMono-Regular",monospace',
  shadow: '0 10px 30px rgba(17,36,27,.08),0 2px 8px rgba(17,36,27,.05)',
}


/* Pseudo-states, keyframes and ::placeholder can't be done inline. */
const CSS = `
  .cm-ps input::placeholder { color: #A9B6AC; }
  .cm-ps input:focus { outline: none; border-color: ${T.vital}; box-shadow: 0 0 0 3px rgba(70,201,139,.18); }
  .cm-ps .btn { transition: transform .18s ease, box-shadow .2s ease, opacity .2s ease; }
  .cm-ps .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(70,201,139,.42); }
  .cm-ps .btn:active:not(:disabled) { transform: translateY(1px); }
  .cm-ps .btn:disabled { opacity: .6; cursor: default; box-shadow: none; }
  .cm-ps .dropzone:hover { border-color: ${T.vital}; background: ${T.mist}; }
  .cm-ps .scanline { animation: cmSweep 1.9s ease-in-out infinite; }
  .cm-ps .barfill { animation: cmSlide 1.5s ease-in-out infinite; }
  @keyframes cmSweep { 0% { top: -34%; } 100% { top: 100%; } }
  @keyframes cmSlide { 0% { transform: translateX(-110%); } 100% { transform: translateX(360%); } }
  @media (prefers-reduced-motion: reduce) {
    .cm-ps .scanline, .cm-ps .barfill { animation: none; }
    .cm-ps .barfill { width: 100%; }
  }
  .cm-ps summary::-webkit-details-marker { display: none; }
  .cm-ps summary { list-style: none; }
`

/* ─── image handling ───────────────────────────────────────────────── */

/* Decode with EXIF orientation applied, so a sideways phone photo isn't
   analysed rotated. createImageBitmap handles it where supported; the <img>
   fallback covers older Safari, which orients by EXIF on its own. */
function decodeOriented(file) {
  if (typeof window.createImageBitmap === 'function') {
    return createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() =>
      decodeViaImgTag(file),
    )
  }
  return decodeViaImgTag(file)
}

function decodeViaImgTag(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ el: img, url })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('decode failed'))
    }
    img.src = url
  })
}

/* Downscale to MAX_EDGE and re-encode as JPEG. Canvas output carries no EXIF,
   so this strips location and device metadata as a side effect. */
async function resize(file) {
  const decoded = await decodeOriented(file)
  const source = decoded.el || decoded
  const objectUrl = decoded.url || null

  const w = source.width
  const h = source.height
  if (!w || !h) throw new Error('decode failed')

  const scale = Math.min(1, MAX_EDGE / Math.max(w, h)) // never upscale
  const cw = Math.max(1, Math.round(w * scale))
  const ch = Math.max(1, Math.round(h * scale))

  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff' // transparent PNGs would otherwise go black in JPEG
  ctx.fillRect(0, 0, cw, ch)
  ctx.drawImage(source, 0, 0, cw, ch)

  if (objectUrl) URL.revokeObjectURL(objectUrl)
  if (source.close) source.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('encode failed'))),
      'image/jpeg',
      JPEG_QUALITY,
    )
  })
}

function toBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const s = String(reader.result)
      const comma = s.indexOf(',')
      comma < 0 ? reject(new Error('read failed')) : resolve(s.slice(comma + 1))
    }
    reader.onerror = () => reject(new Error('read failed'))
    reader.readAsDataURL(blob)
  })
}

/* The score is derived here, not taken from the API. The model behind the
   analyser reads body fat well but scores it like a school grade — it handed a
   lean man a 9/10 and a man at 28-34% a 3/10. The body fat range is the real
   judgement, so the score and the meter are both computed from it. Bands match
   scoreForBodyFat() in worker/src/claude.ts. */
export function scoreForBodyFat(bfLow, bfHigh) {
  const mid = (bfLow + bfHigh) / 2
  if (mid <= 10) return 1
  if (mid <= 13) return 2
  if (mid <= 16) return 3
  if (mid <= 19) return 4
  if (mid <= 22) return 5
  if (mid <= 26) return 6
  if (mid <= 30) return 7
  if (mid <= 35) return 8
  if (mid <= 42) return 9
  return 10
}

export function meaningFor(bfHigh) {
  if (bfHigh <= 12)
    return 'You are already lean. The work from here is holding it without living miserable — training hard enough to keep the muscle and eating enough to stay sane.'
  if (bfHigh <= 17)
    return 'You are in decent shape and close enough that a focused stretch would show real definition. Nothing drastic is needed — consistency and enough protein does it.'
  if (bfHigh <= 22)
    return 'Athletic frame, soft midsection. This is the band where most men stall for years because nothing is obviously wrong. It moves when the food actually gets tracked.'
  if (bfHigh <= 29)
    return 'This is the range where fasting insulin usually starts climbing and energy drops off in the afternoons. It is very reversible, but not by tinkering — it needs a plan.'
  if (bfHigh <= 39)
    return 'At this level the metabolic side matters more than the mirror. Insulin resistance, blood pressure and sleep quality are all likely involved. Get bloodwork, then get a plan.'
  return 'This is a level where health markers, not appearance, should be driving the decision. Get bloodwork done and work with someone. It is fixable, and it is worth doing properly.'
}

/* Meta Pixel Lead event, if and only if a pixel is present. None is installed
   sitewide today, so this is a no-op — written so adding one later needs no
   change here, and a missing one can never throw. */
function trackLead() {
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: 'pudgescore' })
    }
  } catch {
    /* tracking must never block the conversion */
  }
}

/* ─── page ─────────────────────────────────────────────────────────── */

export default function PudgeScorePage() {

  const [step, setStep] = useState('upload') // upload | reading | gate | analyzing | result | problem
  const [result, setResult] = useState(null)
  const [problem, setProblem] = useState({ title: '', body: '' })
  const [loadingText, setLoadingText] = useState('Reading your photo…')
  const [preview, setPreview] = useState(null)
  const [settled, setSettled] = useState(false)

  const [email, setEmail] = useState('')
  const [consented, setConsented] = useState(false)
  const [gateBusy, setGateBusy] = useState(false)
  const [gateError, setGateError] = useState('')

  const fileRef = useRef(null)
  const previewRef = useRef(null)
  /* Holds the resized photo between the gate and the real analysis call —
     the gate has to exist before we know whether we'll ever spend a token
     on this photo, so the payload has to wait around for that answer. */
  const imageBase64Ref = useRef(null)

  /* Object URLs must be released or every retry leaks a photo. */
  useEffect(() => {
    previewRef.current = preview
  }, [preview])
  useEffect(() => () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current) }, [])

  /* Cycles the status line while the real call is in flight. The fake
     "reading" beat is fixed-length and single-message — nothing to cycle. */
  useEffect(() => {
    if (step !== 'analyzing') return
    let i = 0
    const timer = setInterval(() => {
      setLoadingText(LOADING_STEPS[i % LOADING_STEPS.length])
      i++
    }, 1600)
    return () => clearInterval(timer)
  }, [step])

  /* Drives the meter slide. An effect rather than requestAnimationFrame on
     purpose: rAF does not fire in a backgrounded tab, and someone switching
     apps mid-analysis would come back to a marker stuck at zero. */
  useEffect(() => {
    if (step !== 'result') return undefined
    const timer = setTimeout(() => setSettled(true), 60)
    return () => clearTimeout(timer)
  }, [step])

  function fail(title, body) {
    setProblem({ title, body })
    setStep('problem')
  }

  /* Upload -> resize -> the fake "reading" beat -> the gate. No network call
     in here at all — nothing about a photo costs anything until the gate
     downstream is cleared. */
  async function handleFile(file) {
    if (!file) return

    if (file.size > MAX_SOURCE_BYTES) {
      return fail('That photo is enormous', 'Try one straight from your camera roll rather than a RAW or edited export.')
    }

    setStep('reading')
    setLoadingText('Reading your photo…')

    let blob
    try {
      blob = await resize(file)
      if (blob.size > MAX_UPLOAD_BYTES) throw new Error('too big')
    } catch (err) {
      const m = err && err.message
      if (m === 'too big') return fail('Photo too large', 'That photo is too big to send. Try a different one.')
      return fail("Couldn't open that file", 'It may not be a photo, or the format is unsupported. Try a JPEG or PNG.')
    }

    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    setPreview(URL.createObjectURL(blob))

    try {
      imageBase64Ref.current = await toBase64(blob)
    } catch {
      return fail("Couldn't open that file", 'It may not be a photo, or the format is unsupported. Try a JPEG or PNG.')
    }

    // Hold on the fake beat for a fixed minimum so it never feels instant —
    // and never feels like a stall either, since it is always this short.
    await new Promise((r) => setTimeout(r, FAKE_READ_MS))

    setGateError('')
    setStep('gate')
  }

  /* The real call. Only ever reached once the gate has been cleared. */
  async function runAnalysis() {
    setStep('analyzing')
    setLoadingText('Reading the image…')

    let res
    try {
      res = await fetch(`${apiBase()}/api/pudge-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageBase64Ref.current, mediaType: 'image/jpeg' }),
      })
    } catch {
      return fail('No connection', "Couldn't reach the analyser. Check your signal and try again.")
    }

    if (res.status === 429) return fail('Slow down', "You've used your analyses for this hour. Come back later and try again.")
    if (res.status === 413) return fail('Photo too large', 'Even after resizing that came out too big. Try a different photo.')
    if (res.status === 400) return fail("That didn't look like an image", 'Pick a JPEG, PNG or WebP photo and try again.')
    if (!res.ok) return fail('Something broke on our end', 'The analyser is having a moment. Give it a minute and try again.')

    let data
    try {
      data = await res.json()
    } catch {
      return fail('Something broke on our end', 'The analyser is having a moment. Give it a minute and try again.')
    }

    /* pudgeScore 0 is the refusal shape — not a person, a minor, or explicit. */
    if (!data || data.pudgeScore === 0) {
      return fail(
        (data && data.headline) || "Can't read this one",
        (data && data.explanation) || 'Try a front-on torso shot in better light.',
      )
    }

    setResult({ ...data, pudgeScore: scoreForBodyFat(data.bfLow, data.bfHigh) })
    setSettled(false) // park the meter at zero so it has somewhere to travel from
    setStep('result')
  }

  /* Clears the gate, then — and only then — spends a token. Lead capture
     runs first: an email systeme.io itself rejects (bad domain, dead mailbox)
     stops here before any analysis is attempted, so a bad address never costs
     real money. A capture that fails for any other reason (list provider
     outage, our own network hiccup) still lets the visitor through, on the
     same logic as /bodycomp — the promise here is the analysis, not the list. */
  async function submitGate(e) {
    e.preventDefault()

    const value = email.trim()
    if (!value || value.indexOf('@') < 1) return setGateError('Enter a real email address.')
    if (!consented) return setGateError('Tick the box to confirm you want the emails.')

    setGateError('')
    setGateBusy(true)

    let res
    try {
      res = await fetch(`${apiBase()}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      })
    } catch {
      trackLead()
      return runAnalysis()
    }

    if (res.status === 400) {
      setGateBusy(false)
      return setGateError('That email address was rejected. Check it and try again.')
    }
    if (res.status === 429) {
      setGateBusy(false)
      return setGateError('Too many attempts. Give it a few minutes and try again.')
    }

    trackLead()
    return runAnalysis()
  }

  function reset() {
    if (fileRef.current) fileRef.current.value = '' // else re-picking the same photo fires no change
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    imageBase64Ref.current = null
    setPreview(null)
    setResult(null)
    setGateBusy(false)
    setGateError('')
    setEmail('')
    setConsented(false)
    setSettled(false)
    setStep('upload')
  }

  /* ─── shared styles ─────────────────────────────────────────────── */
  const wrap = { maxWidth: 860, margin: '0 auto', paddingInline: 'clamp(20px,5vw,48px)' }
  const narrow = { ...wrap, maxWidth: 620 }
  const h = { fontFamily: T.display, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.08, margin: 0 }
  const eyebrow = {
    display: 'block', fontFamily: T.mono, fontSize: 12.5, fontWeight: 500,
    letterSpacing: '.16em', textTransform: 'uppercase', color: T.moss,
  }
  const btn = {
    display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center',
    fontFamily: T.body, fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em',
    padding: '16px 30px', border: 'none', borderRadius: 100, cursor: 'pointer',
    textDecoration: 'none', background: T.vital, color: T.forest,
    boxShadow: '0 8px 22px rgba(70,201,139,.32)',
  }
  const ghost = {
    ...btn, background: 'transparent', color: T.inkFaint,
    border: `1px solid ${T.line}`, boxShadow: 'none', fontWeight: 600, fontSize: 15, padding: '13px 26px',
  }
  const panel = {
    background: T.paper, border: `1px solid ${T.line}`, borderRadius: 20,
    padding: 'clamp(18px,4vw,26px)', boxShadow: T.shadow,
  }
  const label = {
    display: 'block', marginBottom: 6, fontFamily: T.mono, fontSize: 11,
    letterSpacing: '.12em', textTransform: 'uppercase', color: T.inkFaint,
  }
  const input = {
    width: '100%', padding: '14px 16px', fontFamily: T.body,
    fontSize: 16, /* 16px minimum or iOS Safari zooms the page on focus */
    color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 12,
  }
  const detailH = {
    fontFamily: T.mono, fontWeight: 500, fontSize: 11.5, letterSpacing: '.14em',
    textTransform: 'uppercase', color: T.moss, margin: '22px 0 8px',
  }

  return (
    <div className="cm-ps" style={{ fontFamily: T.body, fontSize: 17, lineHeight: 1.6, letterSpacing: '-0.005em', color: T.ink, background: T.paper }}>
      <style>{CSS}</style>

      {/* header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.paper, borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, height: 64 }}>
          <a href="https://lukestrassner.com/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: T.ink }}>
            <img src={chainmoverLogo} alt="" style={{ height: 34, width: 'auto', objectFit: 'contain', display: 'block', borderRadius: 7 }} />
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Chainmover Coaching</span>
          </a>
          <a className="btn" href={APPLY_URL} style={{ ...btn, width: 'auto', padding: '11px 22px', fontSize: 15 }}>Apply now</a>
        </div>
      </header>

      {/* hero */}
      <section style={{ background: `radial-gradient(120% 120% at 50% -10%,${T.mist} 0%,rgba(232,241,234,0) 55%),${T.paper}`, paddingTop: 'clamp(28px,5vw,56px)', paddingBottom: 'clamp(20px,3vw,28px)', textAlign: 'center' }}>
        <div style={wrap}>
          <span style={eyebrow}>Free · One photo · No signup</span>
          <h1 style={{ ...h, fontSize: 'clamp(34px,7vw,58px)', marginTop: 14 }}>
            What&apos;s your <span style={{ color: T.forest600 }}>Pudge Score</span>?
          </h1>
          <p style={{ margin: '14px auto 0', maxWidth: '30em', fontSize: 'clamp(16px,2vw,18.5px)', color: T.inkSoft }}>
            Upload one photo and get an honest read on where you actually are — an estimated
            body fat range, a score out of 10, and what the picture is really telling you.
          </p>
          {/* Above the fold on purpose. Do not move below the tool. */}
          <p style={{ margin: '18px auto 0', maxWidth: '34em', padding: '10px 16px', background: T.bone, border: `1px solid ${T.line}`, borderRadius: 10, fontSize: 12.5, lineHeight: 1.5, color: T.inkFaint }}>
            <strong style={{ color: T.inkSoft, fontWeight: 600 }}>An AI visual estimate, not a measurement.</strong>{' '}
            Not medical advice or a diagnosis. For real body composition, get a DEXA scan.
          </p>
        </div>
      </section>

      {/* tool */}
      <section style={{ paddingTop: 'clamp(20px,3vw,30px)', paddingBottom: 'clamp(48px,7vw,76px)' }}>
        <div style={narrow}>

          {step === 'upload' && (
            <div style={panel}>
              <label
                className="dropzone"
                htmlFor="ps-photo"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 'clamp(28px,7vw,44px) 20px', background: T.bone, border: `2px dashed ${T.line}`, borderRadius: 14, cursor: 'pointer', textAlign: 'center', transition: 'border-color .2s ease, background .2s ease' }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 40, height: 40, fill: 'none', stroke: T.moss, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', marginBottom: 6 }}>
                  <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2a1 1 0 0 0 .84-.46l.92-1.42A1 1 0 0 1 10.3 3.7h3.4a1 1 0 0 1 .84.42l.92 1.42a1 1 0 0 0 .84.46h1.2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" />
                  <circle cx="12" cy="12.2" r="3.6" />
                </svg>
                <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>Take or choose a photo</span>
                <span style={{ fontFamily: T.mono, fontSize: 11.5, letterSpacing: '.06em', color: T.inkFaint, textTransform: 'uppercase' }}>Front on · torso visible · decent light</span>
              </label>
              <input
                id="ps-photo"
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files && e.target.files[0])}
                style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
              />
              <ul style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'grid', gap: 9 }}>
                {['Never stored — processed once, then gone', 'No account, no history, no upload log', 'Takes about ten seconds'].map((t) => (
                  <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14.5, color: T.inkSoft }}>
                    <span aria-hidden="true" style={{ flex: 'none', width: 17, height: 17, marginTop: 3, borderRadius: '50%', background: T.vitalSoft, display: 'grid', placeItems: 'center' }}>
                      <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, fill: 'none', stroke: T.forest600, strokeWidth: 3.4, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M5 12.6l4.6 4.4L19 7.6" /></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(step === 'reading' || step === 'analyzing') && (
            <div style={{ ...panel, textAlign: 'center' }} aria-live="polite">
              <div style={{ position: 'relative', width: 132, margin: '0 auto 20px', borderRadius: 12, overflow: 'hidden', background: T.bone, aspectRatio: '3 / 4' }}>
                {preview && <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div className="scanline" aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, height: '34%', background: 'linear-gradient(180deg,rgba(70,201,139,0) 0%,rgba(70,201,139,.38) 50%,rgba(70,201,139,0) 100%)' }} />
              </div>
              <div style={{ height: 4, borderRadius: 4, background: T.lineSoft, overflow: 'hidden', maxWidth: 260, margin: '0 auto' }}>
                <div className="barfill" style={{ height: '100%', width: '40%', borderRadius: 4, background: T.vital }} />
              </div>
              <p style={{ marginTop: 16, fontFamily: T.mono, fontSize: 12.5, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkFaint }}>{loadingText}</p>
            </div>
          )}

          {step === 'gate' && (
            <div style={panel}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 4 }}>
                {preview && <img src={preview} alt="" style={{ flex: 'none', width: 60, aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 10, background: T.bone }} />}
                <div>
                  <span style={{ ...eyebrow, fontSize: 11, letterSpacing: '.14em' }}>Photo received</span>
                  <h2 style={{ ...h, fontSize: 'clamp(19px,3.2vw,23px)', marginTop: 4 }}>One thing before we run it</h2>
                </div>
              </div>

              <form onSubmit={submitGate} noValidate style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${T.line}` }}>
                <div style={{ display: 'flex', gap: 13, marginBottom: 18 }}>
                  <span aria-hidden="true" style={{ flex: 'none', width: 38, height: 38, borderRadius: 10, background: T.mist, display: 'grid', placeItems: 'center' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 19, height: 19, fill: 'none', stroke: T.forest600, strokeWidth: 1.7, strokeLinecap: 'round' }}>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" /><rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
                    </svg>
                  </span>
                  <div>
                    <p style={{ margin: 0, fontFamily: T.display, fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: T.ink }}>Where should we send your Pudge Score?</p>
                    <p style={{ marginTop: 5, fontSize: 14.5, color: T.inkSoft }}>Your full read-out — score, body fat range and the markers behind it — goes straight to this page once it's ready.</p>
                  </div>
                </div>

                <label htmlFor="ps-email" style={label}>Email</label>
                <input
                  id="ps-email" type="email" inputMode="email" autoComplete="email"
                  autoCapitalize="none" spellCheck="false" placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (gateError) setGateError('') }}
                  style={{ ...input, borderColor: gateError ? T.danger : T.line }}
                />

                <label htmlFor="ps-consent" style={{ display: 'flex', alignItems: 'flex-start', gap: 11, margin: '16px 0 0', fontSize: 14, lineHeight: 1.45, color: T.inkSoft, cursor: 'pointer' }}>
                  <input
                    id="ps-consent" type="checkbox" checked={consented}
                    onChange={(e) => { setConsented(e.target.checked); if (gateError) setGateError('') }}
                    style={{ flex: 'none', width: 20, height: 20, marginTop: 1, accentColor: T.vital, cursor: 'pointer' }}
                  />
                  <span>Yes, email me fat loss and metabolic health tips from Luke. No spam, unsubscribe any time.</span>
                </label>

                <button type="submit" className="btn" disabled={gateBusy || !consented} style={{ ...btn, marginTop: 14 }}>
                  {gateBusy ? 'One second…' : 'Get my Pudge Score'}
                </button>

                {!consented && !gateError && (
                  <p style={{ margin: '10px 0 0', fontFamily: T.mono, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkFaint, textAlign: 'center' }}>
                    Tick the box above to continue
                  </p>
                )}
                {gateError && <p role="alert" style={{ margin: '12px 0 0', fontSize: 14, color: T.danger }}>{gateError}</p>}
              </form>

              <button type="button" className="btn" onClick={reset} style={{ ...ghost, marginTop: 16 }}>Try another photo</button>
            </div>
          )}

          {step === 'result' && result && (
            <div style={panel}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                {preview && <img src={preview} alt="" style={{ flex: 'none', width: 76, aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 10, background: T.bone }} />}
                <div style={{ minWidth: 0 }}>
                  <span style={{ ...eyebrow, fontSize: 11, letterSpacing: '.14em' }}>Your Pudge Score</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, margin: '4px 0 8px' }}>
                    <span style={{ ...h, fontSize: 'clamp(52px,13vw,68px)', lineHeight: .9, letterSpacing: '-0.04em', color: T.forest600 }}>{result.pudgeScore}</span>
                    <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 20, color: T.inkFaint }}>/10</span>
                  </div>
                  <span style={{ display: 'inline-block', padding: '5px 12px', background: T.mist, borderRadius: 100, fontSize: 13.5, color: T.forest600 }}>
                    Est. body fat <strong style={{ fontWeight: 700 }}>{result.bfLow}–{result.bfHigh}%</strong>
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 22 }} aria-hidden="true">
                <div style={{ position: 'relative', height: 8, borderRadius: 100, background: `linear-gradient(90deg,${T.vital} 0%,#E8A33D 58%,${T.danger} 100%)` }}>
                  <div style={{ position: 'absolute', top: '50%', /* Score runs with the bar: 1 = leanest (left, green), 10 = most fat (right, red). */
                  left: settled ? `${((result.pudgeScore - 0.5) / 10) * 100}%` : '0%', width: 20, height: 20, marginLeft: -10, borderRadius: '50%', background: T.paper, border: `3px solid ${T.forest}`, transform: 'translateY(-50%)', transition: 'left .7s cubic-bezier(.2,.7,.3,1)', boxShadow: '0 2px 6px rgba(17,36,27,.25)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: T.mono, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: T.inkFaint }}>
                  <span>Lean</span><span>Carrying more</span>
                </div>
              </div>

              <p style={{ marginTop: 22, fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(19px,3.2vw,24px)', lineHeight: 1.25, letterSpacing: '-0.02em', color: T.forest }}>
                {result.headline}
              </p>

              <div style={{ marginTop: 24 }}>
                <h3 style={{ ...detailH, marginTop: 0 }}>What the photo shows</h3>
                <p style={{ margin: 0, fontSize: 16.5, color: T.inkSoft }}>{result.explanation}</p>

                <h3 style={detailH}>Markers behind the score</h3>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.markers.map((m) => (
                    <li key={m} style={{ padding: '7px 14px', background: T.bone, border: `1px solid ${T.line}`, borderRadius: 100, fontSize: 14, color: T.inkSoft }}>{m}</li>
                  ))}
                </ul>

                <h3 style={detailH}>What this means for you</h3>
                <p style={{ margin: 0, fontSize: 16.5, color: T.inkSoft }}>{meaningFor(result.bfHigh)}</p>

                <div style={{ marginTop: 28, padding: 22, background: T.forest, borderRadius: 16, textAlign: 'center' }}>
                  <p style={{ fontFamily: T.display, fontWeight: 700, fontSize: 19, letterSpacing: '-0.02em', color: '#fff', marginBottom: 14 }}>Want this handled properly?</p>
                  <a className="btn" href={APPLY_URL} style={{ ...btn, padding: '19px 34px', fontSize: 18 }}>Apply to work with Luke</a>
                </div>
              </div>

              <button type="button" className="btn" onClick={reset} style={{ ...ghost, marginTop: 16 }}>Try another photo</button>
            </div>
          )}

          {step === 'problem' && (
            <div style={{ ...panel, textAlign: 'center' }}>
              <div aria-hidden="true" style={{ width: 46, height: 46, margin: '0 auto 14px', color: T.moss }}>
                <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }}>
                  <circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.2" /><circle cx="12" cy="16.3" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h2 style={{ ...h, fontSize: 22 }}>{problem.title}</h2>
              <p style={{ margin: '10px auto 22px', maxWidth: '30em', fontSize: 15.5, color: T.inkSoft }}>{problem.body}</p>
              <button type="button" className="btn" onClick={reset} style={btn}>Try another photo</button>
            </div>
          )}

        </div>
      </section>

      {/* how it works */}
      <section style={{ background: T.bone, borderTop: `1px solid ${T.line}`, paddingBlock: 'clamp(44px,6vw,68px)' }}>
        <div style={wrap}>
          <span style={{ ...eyebrow, marginBottom: 12 }}>How it works</span>
          <h2 style={{ ...h, fontSize: 'clamp(26px,4vw,36px)', marginBottom: 28 }}>Three steps, about ten seconds</h2>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
            {[
              ['1', 'Upload one photo', 'Front on, torso visible. Shirt off reads most accurately, but a fitted shirt still works.'],
              ['2', 'It gets analysed', 'Your photo is shrunk in your own browser, sent for a single read, and never written to disk anywhere.'],
              ['3', 'You get a straight answer', 'A body fat range, a score, and the visual markers behind it. No hedging, no motivational filler.'],
            ].map(([n, title, body]) => (
              <li key={n} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: 22 }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, marginBottom: 12, borderRadius: '50%', background: T.mist, fontFamily: T.mono, fontSize: 13, color: T.forest600 }}>{n}</span>
                <h3 style={{ ...h, fontSize: 18, marginBottom: 6 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 15, color: T.inkSoft }}>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* faq */}
      <section style={{ paddingBlock: 'clamp(44px,6vw,68px)' }}>
        <div style={narrow}>
          <h2 style={{ ...h, fontSize: 'clamp(26px,4vw,36px)', marginBottom: 28 }}>FAQ</h2>
          {[
            ['What happens to my photo?', "It's resized inside your own browser, sent for one analysis, and discarded. It is never written to a disk, a database, or cloud storage."],
            ['How accurate is it?', "It's a visual estimate. Expect it to be in the right neighbourhood, not exact. Lighting, angle and clothing all move it."],
            // ['Why does it want my email?', "The score and the headline are free and shown immediately. The full breakdown is what the email buys. You'll also get coaching emails from Luke, which you can unsubscribe from in one click."],
            // ['Is this going to be brutal?', "It's direct. It describes what's in the photo the way a coach would — matter of fact, no cruelty and no coddling. If you already know you're carrying weight, you won't be told anything you haven't seen in the mirror. You'll just be told it plainly."],
          ].map(([q, a]) => (
            <details key={q} style={{ borderTop: `1px solid ${T.line}` }}>
              <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18, padding: '18px 0', fontFamily: T.display, fontWeight: 700, fontSize: 16.5, letterSpacing: '-0.02em', userSelect: 'none' }}>
                {q}<span style={{ fontSize: 22, fontWeight: 400, color: T.moss }}>+</span>
              </summary>
              <div style={{ padding: '0 0 18px', fontSize: 15, color: T.inkSoft, lineHeight: 1.65 }}>{a}</div>
            </details>
          ))}
        </div>
      </section>

      <footer style={{ background: T.forest, color: 'rgba(255,255,255,.55)', paddingBlock: 34, textAlign: 'center' }}>
        <div style={wrap}>
          <p style={{ fontSize: 12, lineHeight: 1.6, maxWidth: '46em', marginInline: 'auto' }}>
            Pudge Score is an AI visual estimate for entertainment and motivation. It is not a
            medical measurement, diagnosis, or health advice. For accurate body composition, get a
            DEXA scan. Photos are processed in memory for a single request and never stored.
          </p>
          <p style={{ marginTop: 14, fontFamily: T.mono, fontSize: 11.5, letterSpacing: '.08em', color: 'rgba(255,255,255,.75)' }}>
            Chainmover Coaching · Luke Strassner, Head Coach
          </p>
        </div>
      </footer>
    </div>
  )
}
