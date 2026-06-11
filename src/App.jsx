import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, LinearProgress, Paper } from '@mui/material'

// ─── backend endpoint ─────────────────────────────────────────────
// Paste your deployed Apps Script URL here after setup
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFz--iYveQkyXn9vLUpYuEVvWid0QOZp2vQW3yEcxeHIwvOllqtXTW5nOOJetJtys/exec'

// ─── palette ──────────────────────────────────────────────────────
const GREEN   = '#1B3B2D'
const GREEN_H = '#254d3a'
const GREEN_B = 'rgba(27,59,45,0.7)'
const BG      = '#0a0a0a'
const CARD    = '#141414'
const CARD2   = '#1a1a1a'
const WHITE   = '#ffffff'
const MUTED   = 'rgba(255,255,255,0.45)'
const FAINT   = 'rgba(255,255,255,0.07)'
const RED     = '#ef4444'
const AMBER   = '#f59e0b'
const TEAL    = '#14b8a6'

// ─── quiz definition ──────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'height',
    type: 'height',
    q: 'How tall are you?',
  },
  {
    id: 'weights',
    type: 'weight_pair',
    q: 'What do you weigh right now — and where do you want to be?',
  },
  {
    id: 'age',
    type: 'number',
    q: 'How old are you?',
    unit: 'years',
    min: 18, max: 75,
    placeholder: '34',
  },
  {
    id: 'midsection',
    type: 'choice',
    q: 'When you gain weight, does it go straight to your belly?',
    options: [
      { value: 'yes', label: 'Yes — stomach and midsection first' },
      { value: 'no',  label: 'No — more spread out' },
    ],
  },
  {
    id: 'energy_crash',
    type: 'choice',
    q: 'Do you hit a hard energy crash between 2–4pm most days?',
    sub: 'The kind where you\'re fighting to keep your eyes open.',
    options: [
      { value: 'yes', label: 'Yes, pretty consistently' },
      { value: 'no',  label: 'Not really' },
    ],
  },
  {
    id: 'sleep_quality',
    type: 'choice',
    q: 'Do you wake up tired even after 7+ hours of sleep?',
    options: [
      { value: 'yes', label: 'Yes — I never feel rested' },
      { value: 'no',  label: 'No, sleep usually helps' },
    ],
  },
  {
    id: 'winded',
    type: 'choice',
    q: 'Do you get noticeably winded on stairs or during light activity?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no',  label: 'No' },
    ],
  },
  {
    id: 'family_history',
    type: 'choice',
    q: 'Does a parent or sibling have type 2 diabetes or heart disease — diagnosed before 60?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no',  label: 'No / Not sure' },
    ],
  },
  {
    id: 'stress',
    type: 'choice',
    q: 'How has your stress load been for the last 6+ months?',
    options: [
      { value: 'low',      label: 'Manageable — mostly okay' },
      { value: 'moderate', label: 'Elevated — more than I\'d like' },
      { value: 'high',     label: 'High — it\'s affecting everything' },
      { value: 'crushing', label: 'Crushing — barely keeping it together' },
    ],
  },
  {
    id: 'yoyo',
    type: 'choice',
    q: 'Have you lost a significant amount of weight before and then gained it back?',
    options: [
      { value: 'yes', label: 'Yes — more than once' },
      { value: 'no',  label: 'No, not really' },
    ],
  },
  {
    id: 'timeline',
    type: 'choice',
    q: 'How long have you been meaning to deal with this?',
    options: [
      { value: 'recent',   label: 'Less than a year' },
      { value: 'years',    label: '1–3 years' },
      { value: 'longtime', label: 'Honestly, longer than I want to admit' },
    ],
  },
]

// ─── bucket logic ─────────────────────────────────────────────────
const BUCKETS = {
  early: {
    label: 'Early Warning',
    color: AMBER,
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    headline: "You're not in trouble yet. But the trajectory is set.",
    projection: "If the current pattern holds, here's what the next decade typically looks like for men your age: the visceral fat accumulating now becomes increasingly resistant to diet changes after 35. Blood pressure creeps up — slowly enough that it's easy to ignore. Energy gets worse, not better. By 40, most men in this profile are on at least one medication, have a pre-diabetes marker on a bloodwork panel, and have tried and failed two or three more diets. None of that is inevitable. But it is the default path if the inputs don't change.",
    cta: 'Get your personalized starting point',
    link: "https://drive.google.com/file/d/1hLQYMQjkAu5VMOslzRhJe9ZHoMmntPxA/view?usp=sharing"
  },
  stress: {
    label: 'Metabolic Stress',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.25)',
    headline: 'Your body is compensating. It won\'t do that forever.',
    projection: "The signals in your answers are consistent with a pattern that — if left unchanged — typically leads to a formal diagnosis within 5–7 years. That might be hypertension, pre-diabetes, sleep apnea, or all three. They tend to travel together. The energy crashes you're experiencing aren't laziness. They're your body working harder than it should to process glucose. The weight that won't move isn't stubbornness — it's physiology. Men who change the inputs in their mid-to-late 30s largely reverse this. Men who don't are typically managing multiple conditions by their mid-40s.",
    cta: 'Get the protocol built for your profile',
    link: "https://drive.google.com/file/d/1dt2Ff0ohIWPcGy_TZ7HLOsmfK7bnOf9j/view?usp=sharing"
  },
  high: {
    label: 'High Risk',
    color: RED,
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    headline: "Your body isn't whispering anymore.",
    projection: "Based on your answers, you're carrying a significant metabolic load. The stacked signals — midsection weight, energy crashes, sleep issues, family history — are not separate problems. They're the same problem expressed in different ways. Without changing the inputs, men in this profile typically face their first major health event before 45. That's a hypertension crisis, a T2 diabetes diagnosis, a cardiac event, or a sleep apnea diagnosis that forces the conversation. The window to change the trajectory is still open. But it is not infinite.",
    cta: 'Get the high-risk protocol — built for where you are now',
    link: "https://drive.google.com/file/d/1vgukK1VtLvgfqnWZQ6ztXn5rv4Or9hbC/view?usp=sharing"
  },
}

function getBucket(a) {
  let score = 0
  const w  = Number(a.weight)
  const ft = Number(a.heightFt)
  const inches = Number(a.heightIn) || 0
  const hm = (ft * 12 + inches) * 0.0254
  const bmi = w * 0.453592 / (hm * hm)

  if (bmi >= 35) score += 3
  else if (bmi >= 30) score += 2
  else if (bmi >= 27.5) score += 1

  if (a.midsection === 'yes')    score += 2
  if (a.energy_crash === 'yes')  score += 2
  if (a.sleep_quality === 'yes') score += 2
  if (a.winded === 'yes')        score += 2
  if (a.family_history === 'yes') score += 2
  if (a.stress === 'high' || a.stress === 'crushing') score += 1
  if (a.yoyo === 'yes')          score += 1
  if (a.timeline === 'longtime') score += 1

  return score <= 5 ? 'early' : score <= 10 ? 'stress' : 'high'
}

// ─── macro calc ───────────────────────────────────────────────────
function calcMacros(a) {
  const w   = Number(a.weight)
  const tw  = Number(a.targetWeight)
  const age = Number(a.age)
  const kg  = w * 0.453592
  const cm  = (Number(a.heightFt) * 12 + (Number(a.heightIn) || 0)) * 2.54
  const bmr = 10 * kg + 6.25 * cm - 5 * age + 5

  const calories = Math.max(2000, Math.round(bmr * 1.2))
  const protein  = w > 250 ? 200 : tw
  const fat      = Math.round(w * 0.35)
  const carbs    = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4))
  const fiber    = Math.max(35, Math.round(calories / 1000 * 14))

  return { calories, protein, fat, carbs, fiber }
}

// ─── system flags ─────────────────────────────────────────────────
function getFlags(a) {
  const flags = []
  if (a.midsection === 'yes')
    flags.push({ icon: '🔴', title: 'Visceral Fat Accumulation', body: 'Belly-dominant fat storage is the highest-risk pattern metabolically. It wraps around your organs — not just under the skin — and is directly tied to insulin resistance, inflammation, and cardiovascular risk.' })
  if (a.energy_crash === 'yes')
    flags.push({ icon: '⚡', title: 'Blood Sugar Dysregulation', body: 'The 2–4pm crash is a textbook insulin response pattern. Your body is spiking and crashing glucose after meals. Left unaddressed, this is how insulin resistance develops over years, not days.' })
  if (a.sleep_quality === 'yes')
    flags.push({ icon: '😴', title: 'Sleep Architecture Disruption', body: 'Waking unrefreshed despite adequate hours is a strong signal for sleep apnea — which affects up to 45% of obese men — or for chronic cortisol elevation disrupting deep sleep. Both directly suppress fat loss.' })
  if (a.winded === 'yes')
    flags.push({ icon: '💨', title: 'Cardiovascular Stress', body: 'Getting winded on low-effort activity means your heart and lungs are working significantly harder than they should at rest. This is a direct measure of how much strain your current weight is placing on your system.' })
  if (a.family_history === 'yes')
    flags.push({ icon: '🧬', title: 'Genetic Risk Multiplier', body: 'A first-degree relative with T2 diabetes or early heart disease roughly doubles your lifetime risk. This doesn\'t change the plan — it changes the urgency. You are not starting from the same baseline as someone without this history.' })
  if (a.stress === 'high' || a.stress === 'crushing')
    flags.push({ icon: '🔁', title: 'Cortisol Load', body: 'Chronic high stress elevates cortisol, which tells your body to store fat — preferentially in the abdomen — and suppresses the hormones needed for fat burning. No calorie deficit fully overcomes this signal.' })
  if (a.yoyo === 'yes')
    flags.push({ icon: '📉', title: 'Metabolic Set Point Resistance', body: 'Each cycle of losing and regaining trains your metabolism to protect a higher weight. Your body is now actively defending the number you\'re trying to escape. The fix isn\'t more restriction — it\'s rebuilding the system.' })
  return flags.slice(0, 4)
}

// ─── shared styles ────────────────────────────────────────────────
const numInputSx = {
  background: 'transparent',
  border: 'none',
  borderBottom: '2px solid rgba(255,255,255,0.2)',
  color: WHITE,
  fontSize: 'clamp(2rem, 8vw, 3rem)',
  fontWeight: 800,
  outline: 'none',
  width: '100%',
  maxWidth: 200,
  paddingBottom: 4,
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
}

// ═══════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [step, setStep]               = useState(0)
  const [answers, setAnswers]         = useState({})
  const [phase, setPhase]             = useState('quiz') // 'quiz' | 'capture' | 'results'
  const [results, setResults]         = useState(null)
  const pendingRef                    = useRef(null)

  const total    = QUESTIONS.length
  const progress = phase === 'capture' ? 100 : (step / total) * 100
  const q        = QUESTIONS[step]

  function advance(patch) {
    const updated = { ...answers, ...patch }
    setAnswers(updated)
    if (step < total - 1) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Quiz done — compute results, hold in ref, go to capture gate
      const bucket = getBucket(updated)
      const macros = calcMacros(updated)
      const flags  = getFlags(updated)
      pendingRef.current = { bucket, macros, flags, answers: updated }
      setPhase('capture')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function submitLead(name, email, phone, instagram) {
    const r = pendingRef.current
    const payload = {
      name,
      email,
      phone,
      instagram,
      bucket: BUCKETS[r.bucket].label,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    }

    // Fire-and-forget via GET params — avoids the Apps Script redirect/CORS body-drop issue
    try {
      const r = pendingRef.current
      const a = r.answers
      const bmi = (Number(a.weight) * 0.453592) /
        Math.pow((Number(a.heightFt) * 12 + (Number(a.heightIn) || 0)) * 0.0254, 2)

      const params = new URLSearchParams({
        // lead
        name:      payload.name,
        email:     payload.email,
        phone:     payload.phone,
        instagram: payload.instagram,
        bucket:    payload.bucket,
        timestamp: payload.timestamp,
        // body stats
        height:        `${a.heightFt}ft ${a.heightIn || 0}in`,
        weight:        a.weight,
        target_weight: a.targetWeight,
        age:           a.age,
        bmi:           bmi.toFixed(1),
        // macros
        calories: r.macros.calories,
        protein:  r.macros.protein,
        fat:      r.macros.fat,
        carbs:    r.macros.carbs,
        fiber:    r.macros.fiber,
        // quiz answers
        belly_fat:      a.midsection,
        energy_crash:   a.energy_crash,
        sleep_quality:  a.sleep_quality,
        winded:         a.winded,
        family_history: a.family_history,
        stress:         a.stress,
        yoyo:           a.yoyo,
        timeline:       a.timeline,
      })
      fetch(`${APPS_SCRIPT_URL}?${params}`, { mode: 'no-cors' })
    } catch (_) { /* silent fail — don't block user */ }

    setResults({ ...r, lead: payload })
    setPhase('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function restart() {
    setStep(0)
    setAnswers({})
    setResults(null)
    setPhase('quiz')
    pendingRef.current = null
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (phase === 'results') return <Results results={results} onRestart={restart} />
  if (phase === 'capture') return <LeadCaptureScreen progress={progress} onSubmit={submitLead} />

  return (
    <Box sx={{ minHeight: '100svh', bgcolor: BG, display: 'flex', flexDirection: 'column' }}>
      <LinearProgress variant="determinate" value={progress}
        sx={{ height: 3, bgcolor: '#1a1a1a', '& .MuiLinearProgress-bar': { bgcolor: GREEN } }} />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 3, sm: 6 }, py: 8 }}>
        <Box sx={{ width: '100%', maxWidth: 560 }}>
          <Typography sx={{ color: MUTED, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1, mb: 2.5 }}>
            {step + 1} / {total}
          </Typography>

          <Typography variant="h4" sx={{ color: WHITE, fontWeight: 800, lineHeight: 1.2, mb: q.sub ? 1.5 : 3.5, fontSize: { xs: '1.6rem', sm: '2rem' } }}>
            {q.q}
          </Typography>

          {q.sub && (
            <Typography variant="body2" sx={{ color: MUTED, mb: 3.5, lineHeight: 1.6 }}>{q.sub}</Typography>
          )}

          {q.type === 'height' && <HeightStep onSubmit={(ft, inches) => advance({ heightFt: ft, heightIn: inches })} />}
          {q.type === 'weight_pair' && <WeightPairStep onSubmit={(w, t) => advance({ weight: w, targetWeight: t })} />}
          {q.type === 'number' && <NumberStep key={q.id} unit={q.unit} min={q.min} max={q.max} placeholder={q.placeholder} onSubmit={v => advance({ [q.id]: v })} />}
          {q.type === 'choice' && <ChoiceStep key={q.id} options={q.options} onSelect={v => advance({ [q.id]: v })} />}
        </Box>
      </Box>
    </Box>
  )
}

// ─── height step ──────────────────────────────────────────────────
function HeightStep({ onSubmit }) {
  const [ft, setFt] = useState('')
  const [inches, setIn] = useState('')
  const valid = Number(ft) >= 1 && Number(ft) <= 9

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
          <Box component="input" type="number" value={ft} placeholder="5" min={1} max={9}
            onChange={e => setFt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && valid && onSubmit(Number(ft), Number(inches) || 0)}
            sx={{ ...numInputSx, maxWidth: 100, borderBottomColor: ft ? GREEN : 'rgba(255,255,255,0.2)', '&::-webkit-outer-spin-button,&::-webkit-inner-spin-button': { display: 'none' } }}
          />
          <Typography sx={{ color: MUTED, fontWeight: 600, fontSize: '1.1rem' }}>ft</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
          <Box component="input" type="number" value={inches} placeholder="10" min={0} max={11}
            onChange={e => setIn(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && valid && onSubmit(Number(ft), Number(inches) || 0)}
            sx={{ ...numInputSx, maxWidth: 100, borderBottomColor: inches !== '' ? GREEN : 'rgba(255,255,255,0.2)', '&::-webkit-outer-spin-button,&::-webkit-inner-spin-button': { display: 'none' } }}
          />
          <Typography sx={{ color: MUTED, fontWeight: 600, fontSize: '1.1rem' }}>in</Typography>
        </Box>
      </Box>
      <OKButton disabled={!valid} onClick={() => onSubmit(Number(ft), Number(inches) || 0)} />
    </Box>
  )
}

// ─── weight pair step ─────────────────────────────────────────────
function WeightPairStep({ onSubmit }) {
  const [current, setCurrent] = useState('')
  const [target, setTarget]   = useState('')
  const w  = Number(current)
  const tw = Number(target)
  const valid = w >= 50 && w <= 800 && tw >= 50 && tw < w

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4, mb: 1.5, flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ color: MUTED, fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1 }}>Current</Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
            <Box component="input" type="number" value={current} placeholder="285" min={50} max={800}
              onChange={e => setCurrent(e.target.value)}
              sx={{ ...numInputSx, maxWidth: 130, borderBottomColor: w >= 50 && w <= 800 ? GREEN : 'rgba(255,255,255,0.2)', '&::-webkit-outer-spin-button,&::-webkit-inner-spin-button': { display: 'none' } }}
            />
            <Typography sx={{ color: MUTED, fontWeight: 600 }}>lbs</Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ color: MUTED, fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1 }}>Target</Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
            <Box component="input" type="number" value={target} placeholder="200" min={50} max={800}
              onChange={e => setTarget(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && valid && onSubmit(w, tw)}
              sx={{ ...numInputSx, maxWidth: 130, borderBottomColor: tw >= 50 && tw < w ? GREEN : 'rgba(255,255,255,0.2)', '&::-webkit-outer-spin-button,&::-webkit-inner-spin-button': { display: 'none' } }}
            />
            <Typography sx={{ color: MUTED, fontWeight: 600 }}>lbs</Typography>
          </Box>
        </Box>
      </Box>
      {tw >= w && tw > 0 && (
        <Typography sx={{ color: RED, fontSize: '0.8rem', mb: 1.5 }}>Target must be less than current weight</Typography>
      )}
      <OKButton disabled={!valid} onClick={() => onSubmit(w, tw)} />
    </Box>
  )
}

// ─── number step ──────────────────────────────────────────────────
function NumberStep({ unit, min, max, placeholder, onSubmit }) {
  const [val, setVal] = useState('')
  const n = Number(val)
  const valid = val !== '' && n >= min && n <= max

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 4 }}>
        <Box component="input" type="number" value={val} placeholder={placeholder} min={min} max={max}
          autoFocus
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && valid && onSubmit(n)}
          sx={{ ...numInputSx, borderBottomColor: valid ? GREEN : 'rgba(255,255,255,0.2)', '&::-webkit-outer-spin-button,&::-webkit-inner-spin-button': { display: 'none' } }}
        />
        <Typography sx={{ color: MUTED, fontWeight: 600, fontSize: '1.1rem' }}>{unit}</Typography>
      </Box>
      <OKButton disabled={!valid} onClick={() => onSubmit(n)} />
    </Box>
  )
}

// ─── choice step (auto-advances) ─────────────────────────────────
function ChoiceStep({ options, onSelect }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {options.map(opt => (
        <Box key={opt.value} onClick={() => onSelect(opt.value)}
          sx={{
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2,
            px: 2.5, py: 2, cursor: 'pointer',
            transition: 'all 0.12s',
            '&:hover': { borderColor: GREEN, bgcolor: GREEN },
          }}
        >
          <Typography sx={{ color: WHITE, fontWeight: 600 }}>{opt.label}</Typography>
        </Box>
      ))}
    </Box>
  )
}

// ─── ok button ────────────────────────────────────────────────────
function OKButton({ disabled, onClick }) {
  return (
    <Button variant="contained" disabled={disabled} onClick={onClick}
      sx={{
        bgcolor: GREEN, color: WHITE, fontWeight: 700, px: 4, py: 1.25, borderRadius: 2,
        '&:hover': { bgcolor: GREEN_H },
        '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.06)', color: MUTED },
      }}>
      OK →
    </Button>
  )
}

// ═══════════════════════════════════════════════════════════════════
// LEAD CAPTURE
// ═══════════════════════════════════════════════════════════════════
const textInputSx = {
  background: 'transparent',
  border: 'none',
  borderBottom: '2px solid rgba(255,255,255,0.2)',
  color: WHITE,
  fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
  fontWeight: 700,
  outline: 'none',
  width: '100%',
  paddingBottom: 6,
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
  caretColor: GREEN,
}

function LeadCaptureScreen({ progress, onSubmit }) {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')
  const [instagram, setInsta]   = useState('')
  const [loading, setLoading]   = useState(false)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const valid = name.trim().length >= 2 && emailValid && phone.replace(/\D/g, '').length >= 10 && instagram.trim().length > 1

  async function handleSubmit() {
    if (!valid) return
    setLoading(true)
    await onSubmit(name.trim(), email.trim(), phone.trim(), instagram.trim())
  }

  return (
    <Box sx={{ minHeight: '100svh', bgcolor: BG, display: 'flex', flexDirection: 'column' }}>
      <LinearProgress variant="determinate" value={progress}
        sx={{ height: 3, bgcolor: '#1a1a1a', '& .MuiLinearProgress-bar': { bgcolor: GREEN } }} />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 3, sm: 6 }, py: 8 }}>
        <Box sx={{ width: '100%', maxWidth: 560 }}>

          {/* eyebrow */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: 'rgba(27,59,45,0.4)', border: `1px solid ${GREEN_B}`, borderRadius: 1.5, px: 1.5, py: 0.5, mb: 2.5 }}>
            <Typography sx={{ color: '#6bcfa0', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
              Almost there
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ color: WHITE, fontWeight: 800, lineHeight: 1.2, mb: 1.5, fontSize: { xs: '1.6rem', sm: '2rem' } }}>
            Where should we send your results?
          </Typography>
          <Typography variant="body2" sx={{ color: MUTED, mb: 5, lineHeight: 1.7 }}>
            We'll email you your plan. No spam.
          </Typography>

          {/* Name */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: MUTED, fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1.5 }}>
              First Name
            </Typography>
            <Box
              component="input"
              type="text"
              value={name}
              placeholder="John"
              autoFocus
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('email-input')?.focus()}
              sx={{ ...textInputSx, borderBottomColor: name.trim().length >= 2 ? GREEN : 'rgba(255,255,255,0.2)' }}
            />
          </Box>

          {/* Email */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: MUTED, fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1.5 }}>
              Email
            </Typography>
            <Box
              component="input"
              id="email-input"
              type="email"
              value={email}
              placeholder="john@gmail.com"
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('phone-input')?.focus()}
              sx={{ ...textInputSx, borderBottomColor: emailValid ? GREEN : 'rgba(255,255,255,0.2)' }}
            />
          </Box>

          {/* Phone */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: MUTED, fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1.5 }}>
              Phone Number
            </Typography>
            <Box
              component="input"
              id="phone-input"
              type="tel"
              value={phone}
              placeholder="Phone Here"
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('instagram-input')?.focus()}
              sx={{ ...textInputSx, borderBottomColor: phone.replace(/\D/g, '').length >= 10 ? GREEN : 'rgba(255,255,255,0.2)' }}
            />
          </Box>

          {/* Instagram */}
          <Box sx={{ mb: 5 }}>
            <Typography sx={{ color: MUTED, fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1.5 }}>
              Instagram Handle </Typography>
            <Box
              component="input"
              id="instagram-input"
              type="text"
              value={instagram}
              placeholder="@yourhandle"
              onChange={e => setInsta(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && valid && handleSubmit()}
              sx={{ ...textInputSx, borderBottomColor: instagram.trim().length > 0 ? GREEN : 'rgba(255,255,255,0.2)' }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled={!valid || loading}
            onClick={handleSubmit}
            sx={{
              bgcolor: GREEN, color: WHITE, fontWeight: 800, py: 1.75, borderRadius: 2,
              fontSize: '1rem',
              '&:hover': { bgcolor: GREEN_H },
              '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.06)', color: MUTED },
            }}
          >
            {loading ? 'One moment…' : 'Show My Results →'}
          </Button>

          <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', mt: 2, textAlign: 'center' }}>
            🔒 We don't sell or share your info. Ever.
          </Typography>

        </Box>
      </Box>
    </Box>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════════════════════════════
const BUCKET_ROUTES = { early: '/early', stress: '/stress', high: '/high' }

function Results({ results, onRestart }) {
  const { bucket, macros, flags, answers } = results
  const b = BUCKETS[bucket]
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100svh', bgcolor: BG, display: 'flex', justifyContent: 'center', px: { xs: 2, sm: 4 }, py: 6 }}>
      <Box sx={{ width: '100%', maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* ── Bucket Banner ── */}
        {/* <Paper elevation={0} sx={{ bgcolor: CARD, border: `1px solid ${b.border}`, borderRadius: 3, p: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: b.bg, border: `1px solid ${b.border}`, borderRadius: 1.5, px: 1.5, py: 0.5, mb: 2 }}>
            <Typography sx={{ color: b.color, fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
              {b.label}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: WHITE, fontWeight: 800, mb: 2, lineHeight: 1.3 }}>
            {b.headline}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
            {b.projection}
          </Typography>
        </Paper> */}

        {/* ── Macros ── */}
        <Paper elevation={0} sx={{ bgcolor: CARD, border: `1px solid ${FAINT}`, borderRadius: 3, p: { xs: 3, sm: 4 } }}>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mb: 0.5 }}>
            Your Daily Numbers
          </Typography>
          <Typography variant="h6" sx={{ color: WHITE, fontWeight: 800, mb: 0.5 }}>
            Built for {answers.weight} lbs → {answers.targetWeight} lbs.
          </Typography>
          <Typography variant="body2" sx={{ color: MUTED, mb: 3 }}>
            Mifflin St Jeor · sedentary baseline · 2,000 cal floor
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}>
            <MacroCard label="Calories" value={macros.calories.toLocaleString()} unit="kcal" color={AMBER} />
            <MacroCard label="Protein"  value={macros.protein} unit="g / day" color={TEAL} />
            <MacroCard label="Fat"      value={macros.fat}     unit="g / day" color="#a78bfa" />
            <MacroCard label="Carbs"    value={macros.carbs}   unit="g / day" color="#60a5fa" />
            <MacroCard label="Fiber"    value={macros.fiber}   unit="g / day" color="#34d399" />
          </Box>
          <Box sx={{ mt: 2.5, p: 2, bgcolor: CARD2, borderRadius: 2, border: `1px solid ${FAINT}` }}>
            <Typography variant="body2" sx={{ color: MUTED, lineHeight: 1.7 }}>
              <Box component="span" sx={{ color: TEAL, fontWeight: 700 }}>Protein</Box> is your non-negotiable. Hit it every day regardless of anything else.&nbsp;
              <Box component="span" sx={{ color: '#a78bfa', fontWeight: 700 }}>Fat</Box> protects testosterone — don't cut it.&nbsp;
              <Box component="span" sx={{ color: '#60a5fa', fontWeight: 700 }}>Carbs</Box> fill the rest. Cut them first if you need a deficit, but don't eliminate them.
            </Typography>
          </Box>
        </Paper>

        {/* ── Where System Is Breaking ── */}
        {flags.length > 0 && (
          <Paper elevation={0} sx={{ bgcolor: CARD, border: '1px solid rgba(239,68,68,0.2)', borderRadius: 3, p: { xs: 3, sm: 4 } }}>
            <Typography variant="overline" sx={{ color: 'rgba(239,68,68,0.6)', display: 'block', mb: 0.5 }}>
              What Your Answers Are Telling You
            </Typography>
            <Typography variant="body2" sx={{ color: MUTED, mb: 2.5 }}>
              These are signals, not diagnoses. But they're worth understanding.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {flags.map(f => (
                <Box key={f.title} sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 2 }}>
                  <Box sx={{ fontSize: '1.3rem', lineHeight: 1, mt: 0.15, flexShrink: 0 }}>{f.icon}</Box>
                  <Box>
                    <Typography sx={{ color: '#fca5a5', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>{f.body}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* ── CTA ── */}
        <Paper elevation={0} sx={{ bgcolor: GREEN, border: `1px solid ${GREEN_B}`, borderRadius: 3, p: { xs: 3, sm: 4 } }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1 }}>
            Next Step
          </Typography>
          <Typography variant="h6" sx={{ color: WHITE, fontWeight: 800, mb: 1 }}>
            This gives you the numbers. The resource below gives you the system.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2.5, lineHeight: 1.7 }}>
            The macros above are accurate. But macros without a behavioral framework don't last. What's built for your profile goes deeper than calories.
          </Typography>
          <Button variant="contained" fullWidth onClick={() => navigate(BUCKET_ROUTES[bucket])}
            sx={{ bgcolor: WHITE, color: '#0a0a0a', fontWeight: 800, py: 1.5, borderRadius: 2, fontSize: '0.95rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
            {b.cta} →
          </Button>
        </Paper>

        {/* ── Restart ── */}
        <Button fullWidth variant="outlined" onClick={onRestart}
          sx={{ borderColor: 'rgba(255,255,255,0.1)', color: MUTED, borderRadius: 2, py: 1.25, fontWeight: 600,
            '&:hover': { borderColor: 'rgba(255,255,255,0.25)', bgcolor: 'rgba(255,255,255,0.03)', color: WHITE } }}>
          Start Over
        </Button>

      </Box>
    </Box>
  )
}

// ─── macro card ───────────────────────────────────────────────────
function MacroCard({ label, value, unit, color }) {
  return (
    <Box sx={{ bgcolor: CARD2, border: `1px solid ${FAINT}`, borderRadius: 2, px: 2, py: 2 }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color, fontWeight: 900, fontSize: '1.6rem', lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ color: MUTED, fontSize: '0.7rem', mt: 0.4 }}>{unit}</Typography>
    </Box>
  )
}
