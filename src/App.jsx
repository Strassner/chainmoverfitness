import { useState } from 'react'
import {
  Box, Typography, TextField, MenuItem, Button, Divider, Paper,
  Checkbox, FormControlLabel, LinearProgress,
} from '@mui/material'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'

// ─── palette ──────────────────────────────────────────────────────
const GREEN      = '#1B3B2D'
const GREEN_HV   = '#254d3a'
const GREEN_B    = 'rgba(27,59,45,0.7)'
const BG         = '#0a0a0a'
const CARD       = '#141414'
const CARD2      = '#1a1a1a'
const WHITE      = '#ffffff'
const MUTED      = 'rgba(255,255,255,0.45)'
const FAINT      = 'rgba(255,255,255,0.07)'
const RED        = '#ef4444'
const AMBER      = '#f59e0b'
const TEAL       = '#14b8a6'

// ─── select options ───────────────────────────────────────────────
const STRESS_OPTS = [
  { value: 'low',            label: 'Low — generally calm and manageable' },
  { value: 'moderate',       label: 'Moderate — some daily stress' },
  { value: 'high',           label: 'High — frequently stressed or anxious' },
  { value: 'always_elevated',label: "Always elevated — can't remember the last calm week" },
]
const GLP1_OPTS = [
  { value: 'yes',         label: 'Yes — currently on a GLP-1' },
  { value: 'considering', label: 'Considering it' },
  { value: 'no',          label: 'No' },
]
const OCCUPATION_OPTS = [
  { value: 'desk_job', label: 'Desk job — sitting most of the day' },
  { value: 'hybrid',   label: 'Hybrid — mix of sitting and moving' },
  { value: 'active',   label: 'Physically active — on my feet most of the day' },
]
const PLATEAU_OPTS = [
  { value: '1-2 weeks',  label: '1–2 weeks' },
  { value: '2-4 weeks',  label: '2–4 weeks' },
  { value: '1-3 months', label: '1–3 months' },
  { value: '3+ months',  label: '3+ months' },
]
const SPEED_OPTS = [
  { value: 'slow',     label: 'Slow — 0.5 lb / week' },
  { value: 'moderate', label: 'Moderate — 1 lb / week' },
  { value: 'fast',     label: 'Fast — 1.5–2 lbs / week' },
]
const SPEED_RATE = { slow: 0.5, moderate: 1.0, fast: 1.5 }
const SPEED_DESC = {
  slow:     'Aiming for ~0.5 lb/week — sustainable and muscle-sparing.',
  moderate: 'Aiming for ~1 lb/week — the sweet spot for most people.',
  fast:     "Aiming for 1.5–2 lbs/week — stay consistent, don't skip protein.",
}

const EMPTY = {
  heightFt: '', heightIn: '', weight: '', age: '', targetWeight: '',
  stress: '', currentSleep: '', glp1: '', occupation: '',
  plateau: '', speed: '', yoyo: false,
}

// ─── calculations ─────────────────────────────────────────────────
function calcResults(f) {
  const w  = Number(f.weight)
  const tw = Number(f.targetWeight)
  const age = Number(f.age)
  const kg  = w * 0.453592
  const cm  = (Number(f.heightFt) * 12 + (Number(f.heightIn) || 0)) * 2.54

  // targets
  const steps   = w > 300 ? 7500 : w > 250 ? 9000 : 10000
  const protein = w > 250 ? 200 : tw
  const bmr     = 10 * kg + 6.25 * cm - 5 * age + 5
  const calories = Math.max(2000, Math.round(bmr * 1.2))

  // system score (0–100)
  const sleepHrs = Number(f.currentSleep)
  const sleepPts = sleepHrs >= 7 ? 30 : sleepHrs >= 6 ? 20 : sleepHrs >= 5 ? 10 : 0
  const stressPts = { low: 30, moderate: 20, high: 10, always_elevated: 0 }[f.stress] ?? 15
  const occupPts  = { active: 20, hybrid: 14, desk_job: 6 }[f.occupation] ?? 10
  const plPts     = { '1-2 weeks': 18, '2-4 weeks': 14, '1-3 months': 8, '3+ months': 4 }[f.plateau] ?? 8
  let score = sleepPts + stressPts + occupPts + plPts
  if (f.yoyo) score = Math.max(0, score - 8)
  score = Math.min(100, Math.round(score))

  // 12-week projection
  const targetRate  = SPEED_RATE[f.speed] || 1.0
  const sleepF  = sleepHrs >= 7 ? 1.0 : sleepHrs >= 6 ? 0.75 : sleepHrs >= 5 ? 0.5 : 0.3
  const stressF = { low: 1.0, moderate: 0.85, high: 0.65, always_elevated: 0.4 }[f.stress] ?? 0.85
  const occupF  = { active: 1.0, hybrid: 0.9, desk_job: 0.75 }[f.occupation] ?? 0.85
  const plF     = { '1-2 weeks': 1.0, '2-4 weeks': 0.9, '1-3 months': 0.8, '3+ months': 0.7 }[f.plateau] ?? 0.85
  const currentRate = Math.max(0.05, targetRate * sleepF * stressF * occupF * plF)

  const chartData = Array.from({ length: 13 }, (_, i) => ({
    week: i === 0 ? 'Now' : `Wk ${i}`,
    Optimized: +Math.max(tw, w - i * targetRate).toFixed(1),
    Current:   +Math.max(tw - 5, w - i * currentRate).toFixed(1),
  }))

  // muscle at risk
  const totalLoss12 = targetRate * 12
  const muscleAtRisk = +(totalLoss12 * 0.30).toFixed(1)
  const muscleWithProtein = +(totalLoss12 * 0.08).toFixed(1)
  const muscleSaved = +(muscleAtRisk - muscleWithProtein).toFixed(1)

  // cortisol flag
  const cortisolRisk = f.stress === 'high' || f.stress === 'always_elevated'

  // where system is breaking
  const breaks = []
  if (sleepHrs > 0 && sleepHrs < 7)
    breaks.push({ icon: '😴', label: 'Sleep Debt', msg: `Your current ${sleepHrs}-hour nights are suppressing testosterone and blunting fat loss regardless of what you eat.` })
  if (cortisolRisk)
    breaks.push({ icon: '⚡', label: 'Cortisol Load', msg: 'Chronically elevated cortisol is telling your body to store fat — especially abdominally — and although a calorie deficit always works, this slows it down and reduces fat loss while increasing muscle loss.' })
  if (f.occupation === 'desk_job')
    breaks.push({ icon: '💺', label: 'NEAT Suppression', msg: 'Sitting 8+ hours daily eliminates the 300–500 calories of passive daily burn that active people take for granted. Your steps target accounts for this.' })
  if (f.plateau === '3+ months')
    breaks.push({ icon: '📉', label: 'Metabolic Adaptation', msg: "A 3+ month plateau isn't a willpower problem — it's a systems failure. Your body has adapted. Something in the inputs has to change." })
  if (f.plateau === '1-3 months')
    breaks.push({ icon: '⏳', label: 'Plateau Setting In', msg: "1–3 months at the same weight means the easy phase is over. Your metabolism is recalibrating. Double down on the fundamentals now before full adaptation sets in." })
  if (f.yoyo)
    breaks.push({ icon: '🔁', label: 'Chronic Restarter', msg: "Your history of losing and regaining means your set point is actively working against you. The fix isn't harder restriction — it's building the metabolic foundation first, and this time not dismantling it." })

  return {
    steps, protein, calories, score,
    chartData, currentRate, targetRate,
    muscleAtRisk, muscleWithProtein, muscleSaved,
    cortisolRisk, breaks,
  }
}

// ─── shared field styles ──────────────────────────────────────────
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: WHITE,
    bgcolor: '#1c1c1c',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: GREEN },
  },
  '& .MuiInputLabel-root': { color: MUTED },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6bcfa0' },
  '& .MuiSelect-icon': { color: MUTED },
  '& .MuiFormHelperText-root': { color: '#f87171' },
}

const menuProps = {
  MenuProps: {
    PaperProps: { sx: { bgcolor: '#222', color: WHITE, border: `1px solid ${FAINT}` } },
  },
}
const menuItemSx = { '&:hover': { bgcolor: GREEN }, '&.Mui-selected': { bgcolor: GREEN_HV } }

// ─── section label helper ─────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <Typography sx={{
      color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 1,
      textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', mb: 1.25,
    }}>
      {children}
    </Typography>
  )
}

// ─── select field helper ──────────────────────────────────────────
function SelectField({ label, value, onChange, error, helperText, options }) {
  return (
    <TextField
      select label={label} value={value} onChange={onChange}
      error={!!error} helperText={helperText}
      fullWidth sx={fieldSx} slotProps={{ select: menuProps }}
    >
      {options.map(o => (
        <MenuItem key={o.value} value={o.value} sx={menuItemSx}>{o.label}</MenuItem>
      ))}
    </TextField>
  )
}

// ═══════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [form, setForm]       = useState(EMPTY)
  const [results, setResults] = useState(null)
  const [errors, setErrors]   = useState({})

  function set(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      setErrors(er => ({ ...er, [field]: '' }))
    }
  }
  function toggle(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.checked }))
  }

  function validate() {
    const e = {}
    const w   = Number(form.weight)
    const tw  = Number(form.targetWeight)
    const age = Number(form.age)
    const ft  = Number(form.heightFt)
    const inch = Number(form.heightIn)
    const sl  = Number(form.currentSleep)

    if (!form.heightFt || ft < 1 || ft > 9) e.heightFt = 'Enter feet (1–9)'
    if (form.heightIn !== '' && (inch < 0 || inch > 11)) e.heightIn = '0–11'
    if (!form.weight || w < 50 || w > 800)   e.weight = 'Enter weight (50–800)'
    if (!form.age || age < 10 || age > 100)  e.age = 'Enter age (10–100)'
    if (!form.targetWeight || tw < 50 || tw > 800) e.targetWeight = 'Enter target (50–800)'
    else if (tw >= w) e.targetWeight = 'Must be less than current weight'
    if (!form.currentSleep || sl < 2 || sl > 14) e.currentSleep = 'Enter hours (2–14)'
    if (!form.stress)     e.stress = 'Select one'
    if (!form.occupation) e.occupation = 'Select one'
    if (!form.glp1)       e.glp1 = 'Select one'
    if (!form.plateau)    e.plateau = 'Select one'
    if (!form.speed)      e.speed = 'Select one'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setResults(calcResults(form))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleReset() {
    setForm(EMPTY)
    setResults(null)
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box sx={{ minHeight: '100svh', bgcolor: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, sm: 4 }, py: 6 }}>
      <Box sx={{ width: '100%', maxWidth: 580 }}>

        {/* Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: WHITE, letterSpacing: -0.5, mb: 0.75 }}>
            Fat Loss Calculator
          </Typography>
          <Typography variant="body2" sx={{ color: MUTED }}>
            Fill in every field. The more honest you are, the more useful this gets.
          </Typography>
        </Box>

        {!results ? (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Paper elevation={0} sx={{ bgcolor: CARD, border: `1px solid ${FAINT}`, borderRadius: 3, p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* ── Body Stats ── */}
              <SectionLabel>Body Stats</SectionLabel>

              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1 }}>Height</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField label="Feet" type="number" value={form.heightFt} onChange={set('heightFt')} error={!!errors.heightFt} helperText={errors.heightFt}
                    slotProps={{ htmlInput: { min: 1, max: 9 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>ft</Typography> } }}
                    sx={{ flex: 1, ...fieldSx }} />
                  <TextField label="Inches" type="number" value={form.heightIn} onChange={set('heightIn')} error={!!errors.heightIn} helperText={errors.heightIn}
                    slotProps={{ htmlInput: { min: 0, max: 11 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>in</Typography> } }}
                    sx={{ flex: 1, ...fieldSx }} />
                </Box>
              </Box>

              <TextField label="Current Weight" type="number" value={form.weight} onChange={set('weight')} error={!!errors.weight} helperText={errors.weight} fullWidth sx={fieldSx}
                slotProps={{ htmlInput: { min: 50, max: 800 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>lbs</Typography> } }} />

              <TextField label="Target Bodyweight" type="number" value={form.targetWeight} onChange={set('targetWeight')} error={!!errors.targetWeight} helperText={errors.targetWeight} fullWidth sx={fieldSx}
                slotProps={{ htmlInput: { min: 50, max: 800 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>lbs</Typography> } }} />

              <TextField label="Age" type="number" value={form.age} onChange={set('age')} error={!!errors.age} helperText={errors.age} fullWidth sx={fieldSx}
                slotProps={{ htmlInput: { min: 10, max: 100 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>yrs</Typography> } }} />

              <Divider sx={{ borderColor: FAINT }} />

              {/* ── Lifestyle ── */}
              <SectionLabel>Lifestyle</SectionLabel>

              <TextField label="Hours of sleep you currently get" type="number" value={form.currentSleep} onChange={set('currentSleep')} error={!!errors.currentSleep} helperText={errors.currentSleep} fullWidth sx={fieldSx}
                slotProps={{ htmlInput: { min: 2, max: 14, step: 0.5 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>hrs</Typography> } }} />

              <SelectField label="Current stress level" value={form.stress} onChange={set('stress')} error={errors.stress} helperText={errors.stress} options={STRESS_OPTS} />
              <SelectField label="Occupation type" value={form.occupation} onChange={set('occupation')} error={errors.occupation} helperText={errors.occupation} options={OCCUPATION_OPTS} />
              <SelectField label="Are you on a GLP-1?" value={form.glp1} onChange={set('glp1')} error={errors.glp1} helperText={errors.glp1} options={GLP1_OPTS} />

              <FormControlLabel
                control={
                  <Checkbox checked={form.yoyo} onChange={toggle('yoyo')}
                    sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#6bcfa0' } }} />
                }
                label={<Typography variant="body2" sx={{ color: MUTED }}>I've lost weight before and regained it</Typography>}
              />

              <Divider sx={{ borderColor: FAINT }} />

              {/* ── Goals ── */}
              <SectionLabel>Goals</SectionLabel>

              <SelectField label="How long have you been plateaued?" value={form.plateau} onChange={set('plateau')} error={errors.plateau} helperText={errors.plateau} options={PLATEAU_OPTS} />
              <SelectField label="How fast do you want to lose weight?" value={form.speed} onChange={set('speed')} error={errors.speed} helperText={errors.speed} options={SPEED_OPTS} />

              <Button type="submit" variant="contained" size="large" fullWidth
                sx={{ mt: 0.5, bgcolor: GREEN, color: WHITE, fontWeight: 700, fontSize: '0.95rem', py: 1.5, borderRadius: 2, '&:hover': { bgcolor: GREEN_HV } }}>
                Calculate My Plan
              </Button>
            </Paper>
          </Box>
        ) : (
          <Results results={results} form={form} onReset={handleReset} />
        )}
      </Box>
    </Box>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════════════════════════════
function Results({ results, form, onReset }) {
  const w = Number(form.weight)
  const { steps, protein, calories, score, chartData, targetRate, currentRate,
    muscleAtRisk, muscleWithProtein, muscleSaved, breaks } = results

  const scoreColor = score >= 70 ? TEAL : score >= 40 ? AMBER : RED
  const scoreLabel = score >= 70 ? 'Strong Foundation' : score >= 40 ? 'Building' : 'Needs Work'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* ── System Score ── */}
      <Paper elevation={0} sx={{ bgcolor: CARD, border: `1px solid ${FAINT}`, borderRadius: 3, p: { xs: 3, sm: 4 } }}>
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mb: 1.5 }}>
          Your System Score
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.5 }}>
          <Typography sx={{ fontSize: { xs: '3.5rem', sm: '4.5rem' }, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
            {score}
          </Typography>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600, fontSize: '1.1rem' }}>/100</Typography>
            <Typography sx={{ color: scoreColor, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>
              {scoreLabel}
            </Typography>
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={score}
          sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.07)',
            '& .MuiLinearProgress-bar': { bgcolor: scoreColor, borderRadius: 4 } }} />
        <Typography variant="body2" sx={{ color: MUTED, mt: 1.5, lineHeight: 1.6 }}>
          Built from your sleep, stress, occupation, and plateau history — not your motivation. This is your foundation score before you've changed a single habit.
        </Typography>
      </Paper>

      {/* ── Daily Targets ── */}
      <Paper elevation={0} sx={{ bgcolor: CARD, border: `1px solid ${FAINT}`, borderRadius: 3, p: { xs: 3, sm: 4 } }}>
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mb: 0.5 }}>Your Daily Targets</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: WHITE, mb: 2.5 }}>Here's your plan.</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ResultCard emoji="👟" label="Daily Steps" value={steps.toLocaleString()}
            detail={w > 300 ? "Over 300 lbs — start here, build the habit" : w > 250 ? "Over 250 lbs — ramp up as this gets easy" : 'Non-negotiable minimum every single day'} />
          <ResultCard emoji="🥩" label="Daily Protein" value={`${protein}g`}
            detail={w > 250 ? '200g cap — no need to go higher at your weight' : `1g per lb of your ${form.targetWeight} lb goal weight`} />
          <ResultCard emoji="🔥" label="Daily Calories" value={calories.toLocaleString()}
            detail="Mifflin St Jeor · sedentary · 2,000 cal floor" />
          <ResultCard emoji="😴" label="Sleep Target" value="7+ hrs"
            detail={Number(form.currentSleep) < 7
              ? `You're currently at ${form.currentSleep} hrs — closing this gap is your #1 lever`
              : 'Every night — non-negotiable for fat loss and recovery'} />
          <ResultCard emoji="🏋️" label="Workouts" value="3× / week"
            detail="Full body 3×/week  —  or  Upper / Lower / Upper" />
        </Box>
      </Paper>

      {/* ── Where System Is Breaking ── */}
      {breaks.length > 0 && (
        <Paper elevation={0} sx={{ bgcolor: CARD, border: `1px solid rgba(239,68,68,0.25)`, borderRadius: 3, p: { xs: 3, sm: 4 } }}>
          <Typography variant="overline" sx={{ color: 'rgba(239,68,68,0.7)', display: 'block', mb: 0.5 }}>
            Where Your System Is Breaking
          </Typography>
          <Typography variant="body2" sx={{ color: MUTED, mb: 2.5 }}>
            These aren't character flaws. They're inputs that are actively working against you right now.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {breaks.map(b => (
              <Box key={b.label} sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 2 }}>
                <Box sx={{ fontSize: '1.4rem', lineHeight: 1, mt: 0.2, flexShrink: 0 }}>{b.icon}</Box>
                <Box>
                  <Typography sx={{ color: '#fca5a5', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                    {b.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    {b.msg}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* ── 12-week Projection ── */}
      <Paper elevation={0} sx={{ bgcolor: CARD, border: `1px solid ${FAINT}`, borderRadius: 3, p: { xs: 3, sm: 4 } }}>
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mb: 0.5 }}>
          12-Week Fat Loss Projection
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: WHITE, mb: 0.5 }}>
          The gap is the cost of your current habits.
        </Typography>
        <Typography variant="body2" sx={{ color: MUTED, mb: 3 }}>
          <Box component="span" sx={{ color: TEAL, fontWeight: 700 }}>Optimized</Box> = hitting all four targets. &nbsp;
          <Box component="span" sx={{ color: AMBER, fontWeight: 700 }}>Current</Box> = your trajectory based on sleep, stress & occupation.
        </Typography>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false}
              domain={[d => Math.floor(d - 3), d => Math.ceil(d + 1)]} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="Optimized" stroke={TEAL} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Current"   stroke={AMBER} strokeWidth={2.5} dot={false} strokeDasharray="5 4" />
          </LineChart>
        </ResponsiveContainer>
        <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
          <Stat label="Optimized rate" value={`${targetRate} lb / wk`} color={TEAL} />
          <Stat label="Current trajectory" value={`${currentRate.toFixed(2)} lb / wk`} color={AMBER} />
          <Stat label="12-wk gap" value={`${((targetRate - currentRate) * 12).toFixed(1)} lbs`} color="rgba(255,255,255,0.5)" />
        </Box>
      </Paper>

      {/* ── Muscle At Risk ── */}
      <Paper elevation={0} sx={{ bgcolor: CARD, border: `1px solid rgba(245,158,11,0.25)`, borderRadius: 3, p: { xs: 3, sm: 4 } }}>
        <Typography variant="overline" sx={{ color: AMBER, display: 'block', mb: 0.5 }}>
          Muscle At Risk
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: WHITE, mb: 1 }}>
          Over 12 weeks at your target rate:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'rgba(239,68,68,0.08)', borderRadius: 2, border: '1px solid rgba(239,68,68,0.15)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Without hitting your {protein}g protein target</Typography>
            <Typography sx={{ color: RED, fontWeight: 800 }}>−{muscleAtRisk} lbs muscle</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'rgba(20,184,166,0.08)', borderRadius: 2, border: '1px solid rgba(20,184,166,0.15)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>With protein target met</Typography>
            <Typography sx={{ color: TEAL, fontWeight: 800 }}>−{muscleWithProtein} lbs muscle</Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: GREEN, borderRadius: 2 }}>
            <Typography sx={{ color: WHITE, fontWeight: 700 }}>
              Hitting your protein target saves you an estimated <Box component="span" sx={{ color: '#6bcfa0' }}>{muscleSaved} lbs of lean mass</Box> over the next 12 weeks.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ── GLP-1 Block ── */}
      {(form.glp1 === 'yes' || form.glp1 === 'considering') && (
        <Paper elevation={0} sx={{ bgcolor: CARD, border: '1px solid rgba(139,92,246,0.3)', borderRadius: 3, p: { xs: 3, sm: 4 } }}>
          <Typography variant="overline" sx={{ color: 'rgba(167,139,250,0.8)', display: 'block', mb: 0.5 }}>
            GLP-1 Optimization
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: WHITE, mb: 2 }}>
            {form.glp1 === 'yes' ? 'What the medication is doing — and where it stops.' : 'Before you decide — what the research actually shows.'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Glp1Block title="What GLP-1 does biologically" color="rgba(167,139,250,0.15)" borderColor="rgba(139,92,246,0.2)">
              GLP-1 agonists slow gastric emptying, suppress appetite via the hypothalamus, and improve insulin sensitivity. At their best, they reduce caloric intake by 400–600 cal/day without conscious effort. They are a genuine metabolic tool — not a shortcut.
            </Glp1Block>
            <Glp1Block title="What stalls it" color="rgba(239,68,68,0.08)" borderColor="rgba(239,68,68,0.2)">
              Poor sleep spikes ghrelin and blunts the appetite-suppression effect. Chronic stress elevates cortisol, which counteracts the insulin-sensitizing mechanism. Low protein intake means the weight you lose on GLP-1 is 30–40% lean mass — you get smaller and weaker, not leaner and stronger.
            </Glp1Block>
            <Glp1Block title="What the foundation does that medication cannot" color="rgba(20,184,166,0.08)" borderColor="rgba(20,184,166,0.2)">
              GLP-1 reduces the input side. The foundation — steps, protein, sleep, stress management — rebuilds the metabolic infrastructure. The medication suppresses hunger. The habits change what you do with the absence of hunger. You need both for the result to last.
            </Glp1Block>
          </Box>
        </Paper>
      )}

      {/* ── Speed Goal ── */}
      <Box sx={{ bgcolor: GREEN, border: `1px solid ${GREEN_B}`, borderRadius: 2, px: 2.5, py: 2 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          Speed Goal
        </Typography>
        <Typography variant="body1" sx={{ color: WHITE, fontWeight: 600 }}>
          {SPEED_DESC[form.speed]}
        </Typography>
      </Box>

      {/* ── Chronic Restarter Banner ── */}
      {form.yoyo && (
        <Box sx={{ bgcolor: '#1a1010', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 2, px: 2.5, py: 2.5 }}>
          <Typography sx={{ color: '#fca5a5', fontWeight: 700, fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase', mb: 0.75 }}>
            A note for the chronic restarter
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            You've done this before. You know how to lose weight — you've proven it. What failed wasn't your discipline. It was that nothing changed in the environment, the stress, the sleep, or the identity you returned to when the diet ended. The score above tells you where the system actually broke. Fix the system this time, not just the food.
          </Typography>
        </Box>
      )}

      {/* ── Action buttons ── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button fullWidth variant="outlined" onClick={onReset}
          sx={{ borderColor: 'rgba(255,255,255,0.12)', color: MUTED, borderRadius: 2, py: 1.25, fontWeight: 600,
            '&:hover': { borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.04)', color: WHITE } }}>
          Start Over
        </Button>
        <Button href="https://docs.google.com/document/d/1pmwyuSIfxG2MYrsHDgtuqDD8kEVOYLz7KFm1_p3j_m8/edit?usp=sharing"
            variant="outlined" fullWidth target="_blank"
            sx={{ borderColor: GREEN_B, color: '#6bcfa0', borderRadius: 2, py: 1.25, fontWeight: 600,
              '&:hover': { borderColor: GREEN, bgcolor: GREEN, color: WHITE } }}>
            Take the Identity Audit
          </Button>
        <Button href="https://form.typeform.com/to/o0oRp5Ie"    variant="outlined" fullWidth target="_blank"
            sx={{ borderColor: GREEN_B, color: '#6bcfa0', borderRadius: 2, py: 1.25, fontWeight: 600,
              '&:hover': { borderColor: GREEN, bgcolor: GREEN, color: WHITE }, textAlign: 'center' }}>
            1-1 Coaching Application:<br />Lose 50 lbs guaranteed or I'll work for free until you do
          </Button>
      </Box>

    </Box>
  )
}

// ─── result card ──────────────────────────────────────────────────
function ResultCard({ emoji, label, value, detail }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: CARD2, border: `1px solid ${FAINT}`, borderRadius: 2, px: 2.5, py: 2 }}>
      <Box sx={{ width: 44, height: 44, borderRadius: 1.5, bgcolor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
        {emoji}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block' }}>
          {label}
        </Typography>
        {detail && (
          <Typography variant="body2" sx={{ color: MUTED, mt: 0.25, lineHeight: 1.4 }}>{detail}</Typography>
        )}
      </Box>
      <Typography sx={{ fontWeight: 800, color: WHITE, fontSize: { xs: '1.35rem', sm: '1.55rem' }, lineHeight: 1, whiteSpace: 'nowrap', ml: 1 }}>
        {value}
      </Typography>
    </Box>
  )
}

// ─── mini stat ────────────────────────────────────────────────────
function Stat({ label, value, color }) {
  return (
    <Box>
      <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</Typography>
      <Typography sx={{ color, fontWeight: 800, fontSize: '1rem' }}>{value}</Typography>
    </Box>
  )
}

// ─── glp1 block ───────────────────────────────────────────────────
function Glp1Block({ title, color, borderColor, children }) {
  return (
    <Box sx={{ p: 2.5, bgcolor: color, border: `1px solid ${borderColor}`, borderRadius: 2 }}>
      <Typography sx={{ color: WHITE, fontWeight: 700, mb: 0.75, fontSize: '0.85rem' }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>{children}</Typography>
    </Box>
  )
}

// ─── recharts tooltip ─────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <Box sx={{ bgcolor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1.5, px: 2, py: 1.5 }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', mb: 0.75 }}>{label}</Typography>
      {payload.map(p => (
        <Box key={p.dataKey} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.stroke }} />
          <Typography sx={{ color: WHITE, fontSize: '0.85rem', fontWeight: 700 }}>{p.value} lbs</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{p.dataKey}</Typography>
        </Box>
      ))}
    </Box>
  )
}
