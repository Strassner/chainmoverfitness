import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import type { MediaType } from './image';

/**
 * The whole engine: one multimodal call to Claude Haiku 4.5.
 *
 * The response shape is enforced by structured outputs rather than by asking
 * the model nicely and parsing whatever comes back. That removes the older
 * JSON-forcing stack entirely — no assistant-turn prefill, no "return ONLY
 * JSON" instruction, no brace-matching extractor, no retry-on-parse loop.
 */

const MODEL = 'claude-haiku-4-5';
const TIMEOUT_MS = 30_000;

/** Bands are 4-6 points wide and never a single number — see the prompt. */
const AnalysisSchema = z.object({
  bf_low: z.number().int(),
  bf_high: z.number().int(),
  /** 1-10 where 1 is leanest and 10 is carrying the most fat. 0 means the photo could not be read. */
  pudge_score: z.number().int(),
  headline: z.string(),
  explanation: z.string(),
  markers: z.array(z.string())
});

/** What we hand back to the browser. Field names match what the page reads. */
export interface PudgeResult {
  bfLow: number;
  bfHigh: number;
  pudgeScore: number; // 1-10, or 0 for a refusal
  headline: string;
  explanation: string;
  markers: string[];
}

/**
 * Returns null when the call failed or the model produced something we could
 * not use — the caller turns that into a 502. A refusal is not a failure; it
 * comes back as a result with pudgeScore 0.
 */
export async function analyse(
  imageBase64: string,
  mediaType: MediaType,
  apiKey: string,
  baseURL?: string
): Promise<PudgeResult | null> {
  const client = new Anthropic({
    apiKey,
    timeout: TIMEOUT_MS,
    ...(baseURL ? { baseURL } : {})
  });

  let response;
  try {
    response = await client.messages.parse({
      model: MODEL,
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: 'Analyze this physique photo.' }
          ]
        }
      ],
      output_config: { format: zodOutputFormat(AnalysisSchema) }
    });
  } catch (err) {
    // Status and type only. The body can echo request detail back, and there is
    // no reason to widen what ends up in the logs.
    if (err instanceof Anthropic.APIError) {
      // The message says which field or model was rejected. It is Anthropic's
      // own error text and never contains our key, which travels in a request
      // header — so it is safe to log, and without it a 400 is undiagnosable.
      console.warn(`anthropic ${err.status} ${err.name}: ${String(err.message).slice(0, 400)}`);
    } else {
      console.warn('anthropic call failed:', String(err).slice(0, 400));
    }
    return null;
  }

  // The model declining on safety grounds is not the same as our own failure,
  // but from the visitor's side both mean "no result" — surface it as a refusal
  // so the page asks for a different photo instead of showing an error.
  if (response.stop_reason === 'refusal') {
    console.warn('anthropic refused:', response.stop_details?.category ?? 'unknown');
    return {
      bfLow: 0,
      bfHigh: 0,
      pudgeScore: 0,
      headline: "Can't read this one",
      explanation: 'Try a different photo — front on, torso visible, nothing explicit.',
      markers: []
    };
  }

  // Documented to be null when the response did not parse against the schema.
  if (!response.parsed_output) {
    console.warn('structured output did not parse; stop_reason:', response.stop_reason);
    return null;
  }

  return validate(response.parsed_output);
}

/**
 * Body fat midpoint -> pudge score. Higher score = carrying more fat, so a lean
 * man scores 1-2 and the top of the scale is reserved for the highest ranges.
 * The bands follow the calibration anchors in the system prompt.
 */
export function scoreForBodyFat(bfLow: number, bfHigh: number): number {
  const mid = (bfLow + bfHigh) / 2;
  if (mid <= 10) return 1;
  if (mid <= 13) return 2;
  if (mid <= 16) return 3;
  if (mid <= 19) return 4;
  if (mid <= 22) return 5;
  if (mid <= 26) return 6;
  if (mid <= 30) return 7;
  if (mid <= 35) return 8;
  if (mid <= 42) return 9;
  return 10;
}

/**
 * The schema guarantees the shape, not the sense. A plausible-looking result
 * with impossible numbers is worse than a 502, because it renders as though it
 * were real.
 */
function validate(raw: z.infer<typeof AnalysisSchema>): PudgeResult | null {
  const headline = raw.headline.trim().slice(0, 200) || "Can't read this one";
  let explanation = raw.explanation.trim().slice(0, 1000);

  if (raw.pudge_score === 0) {
    if (!explanation) explanation = "That photo isn't something this can read. Try a front-on torso shot.";
    return { bfLow: 0, bfHigh: 0, pudgeScore: 0, headline, explanation, markers: [] };
  }

  if (raw.pudge_score < 1 || raw.pudge_score > 10) {
    console.warn('model returned out-of-range pudge_score:', raw.pudge_score);
    return null;
  }

  if (raw.bf_low < 1 || raw.bf_high > 80 || raw.bf_low > raw.bf_high) {
    console.warn('model returned an impossible range:', raw.bf_low, raw.bf_high);
    return null;
  }

  /* The model reads body fat well but scores it like a school grade — a lean
     man kept coming back as a 9/10. The range is the real judgement, so the
     score is derived from it and the model's own number is only a cross-check. */
  const pudgeScore = scoreForBodyFat(raw.bf_low, raw.bf_high);
  if (Math.abs(pudgeScore - raw.pudge_score) >= 4) {
    console.warn('model score disagreed with its own range:', raw.pudge_score, 'vs', pudgeScore, `(${raw.bf_low}-${raw.bf_high}%)`);
  }

  if (!explanation) {
    console.warn('model returned a result with no explanation');
    return null;
  }

  const markers = raw.markers
    .filter((m) => typeof m === 'string' && m.trim() !== '')
    .slice(0, 6)
    .map((m) => m.trim().slice(0, 160));

  return {
    bfLow: raw.bf_low,
    bfHigh: raw.bf_high,
    pudgeScore,
    headline,
    explanation,
    markers
  };
}

/**
 * No JSON shape, no "return only JSON", no code-fence warning — the schema
 * handles all of that. This prompt is only about what to look at, how to
 * calibrate, and how to speak.
 */
const SYSTEM_PROMPT = `You are a visual physique estimator for a fitness coaching lead-generation tool.
You estimate approximate body fat percentage from a single photo. This is a rough
visual estimate for motivational purposes — it is explicitly NOT a medical or
diagnostic measurement, and you should never imply otherwise.

Assess visible markers only:
- Abdominal definition and whether the midsection protrudes past the chest line
- Waist-to-shoulder ratio
- Fat distribution across torso, face, and limbs
- Vascularity in forearms and shoulders
- Muscle separation and striation
- Skin fold / soft tissue behavior at the flank and lower back

Calibration anchors for adult men:
- 8-12%: clear abdominal separation, visible vascularity, defined obliques
- 13-17%: flat midsection, upper abs faint, some definition when lit well
- 18-22%: no visible abs, soft midsection, still clearly athletic frame possible
- 23-29%: midsection protrudes, face fullness, waist approaching chest width
- 30-39%: significant abdominal mass, waist exceeds chest, fullness in face and limbs
- 40%+: substantial fat across all regions

Estimate conservatively. bf_low and bf_high must be 4-6 percentage points apart —
never the same number. If the photo is poorly lit, heavily clothed, low resolution,
or not a torso shot, widen the range and say so in the explanation rather than
guessing precisely.

pudge_score runs 1-10 and measures how much fat is being carried — it is NOT a
grade or a rating out of 10, so a lean, in-shape man scores LOW, not high.
1 means the leanest; 10 means carrying the most fat. Lower body fat gets a lower
score; higher body fat gets a higher score. It must agree with the body fat range
you gave: 8-12% is a 1-2, 13-17% is a 2-3, 18-22% is a 4-5, 23-29% is a 6-7,
30-39% is an 8-9, 40%+ is a 10. A lean range with a high pudge_score (or a heavy
range with a low one) is a contradiction.

headline: one punchy line, under 12 words.
explanation: 2-3 sentences on what you observed and what it means.
markers: 2-4 short phrases naming the specific visual cues you keyed on.

TONE: Direct and observational. Not cruel, not coddling. You are describing what you
see the way a coach would — matter-of-fact, no hedging, no motivational fluff, no
"but remember, you're beautiful!" The reader is a man who already knows he's
overweight and is tired of being handled gently. Respect that.

REFUSALS — set pudge_score to 0, bf_low and bf_high to 0, markers to an empty list,
and give a one-sentence explanation of why, if the image is:
- Not a person, or not a torso/full-body shot of a person
- A minor, or ambiguous in age toward being a minor
- Nude or sexually explicit (genitals)`;
