/* ─────────────────────────────────────────────────────────────────────
   proofUtils.jsx

   Shared "proof" building blocks — written testimonials, before/after
   photo pairs, matched-testimonial cards, and video testimonial grids —
   reused across LandingPage.jsx, LandingSalesPage.jsx, PostCallPage.jsx,
   and BucketPage.jsx.

   These are pure presentation components. Each page keeps its own data
   (its own QUOTES array, its own images, its own copy) and passes it in
   as props, along with its own `T` design-token object and the exact
   layout/style values it already used. Nothing here invents new
   defaults that could change how an existing page looks — change the
   data at the call site, or change the markup/styles here once and it
   updates everywhere that component is used.
   ───────────────────────────────────────────────────────────────────── */

/* ─── Written quote card ─────────────────────────────────────────────
   q: { name, stat, quote }
   Pass the exact style objects the page already used for cardStyle /
   quoteStyle / footerStyle / nameStyle / statStyle so rendering is
   unchanged; only the JSX structure is centralized.                   */
export function QuoteCard({ q, className, cardStyle, quoteStyle, footerStyle, nameStyle, statStyle }) {
  return (
    <blockquote className={className} style={cardStyle}>
      <p style={quoteStyle}>“{q.quote}”</p>
      <footer style={footerStyle}>
        <b style={nameStyle}>{q.name}</b>
        <span style={statStyle}>{q.stat}</span>
      </footer>
    </blockquote>
  )
}

/* Grid of QuoteCards. Pass quotes + the outer grid className/style the
   page already used, plus the per-card style props above.             */
export function QuoteGrid({ quotes, className, gridStyle, cardClassName, cardStyle, quoteStyle, footerStyle, nameStyle, statStyle }) {
  return (
    <div className={className} style={gridStyle}>
      {quotes.map(q => (
        <QuoteCard
          key={q.name}
          q={q}
          className={cardClassName}
          cardStyle={cardStyle}
          quoteStyle={quoteStyle}
          footerStyle={footerStyle}
          nameStyle={nameStyle}
          statStyle={statStyle}
        />
      ))}
    </div>
  )
}

/* ─── Transformation photo (single before/after collage) ─────────────
   Each client photo is one image with "before" on the left half and
   "after" on the right half already side by side in the same shot.
   "Before" / "After" badges get pinned to the top corners over it.    */
export function TransformationPhoto({ T, src, alt, minHeight = 300, badgeOffset = 12, beforeLabel = 'Before', afterLabel = 'After' }) {
  return (
    <div style={{ position: 'relative' }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', minHeight, objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: badgeOffset, left: badgeOffset, fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: 'rgba(17,36,27,.72)', color: '#fff', padding: '4px 9px', borderRadius: 100 }}>{beforeLabel}</span>
      <span style={{ position: 'absolute', top: badgeOffset, right: badgeOffset, fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: T.vital, color: T.forest, padding: '4px 9px', borderRadius: 100 }}>{afterLabel}</span>
    </div>
  )
}

/* ─── Featured transformation card ───────────────────────────────────
   TransformationPhoto plus a copy panel: name, stat, quote. Matches the
   featured "Larry / Daniel / Matt" blocks at the top of the proof
   section.                                                            */
export function FeaturedTransformation({ T, photoSrc, photoAlt, name, stat, quote, columns = '1.2fr .8fr', minHeight = 300, className = 'ba-grid', style }) {
  return (
    <div className={className} style={{ display: 'grid', gridTemplateColumns: columns, gap: 28, alignItems: 'center', background: T.paper, border: `1px solid ${T.line}`, borderRadius: 20, overflow: 'hidden', boxShadow: T.shadow, marginBottom: 24, ...style }}>
      <TransformationPhoto T={T} src={photoSrc} alt={photoAlt || `${name} before and after`} minHeight={minHeight} />
      <div style={{ padding: 'clamp(24px,3vw,36px)' }}>
        <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 28, color: T.forest }}>{name}</div>
        <div style={{ fontFamily: T.mono, fontSize: 12.5, color: T.moss, marginTop: 4 }}>{stat}</div>
        <p style={{ marginTop: 14, fontSize: 15.5, color: T.inkSoft, lineHeight: 1.6 }}>“{quote}”</p>
      </div>
    </div>
  )
}

/* ─── Person story feature ───────────────────────────────────────────
   Single photo plus a headline and any number of narrative paragraphs.
   Used for Luke's own story block on /landing.                        */
export function PersonStoryFeature({ T, photoSrc, photoAlt, headline, paragraphs, columns = '.8fr 1.2fr', minHeight = 260, className = 'ba-grid', style }) {
  return (
    <div className={className} style={{ display: 'grid', gridTemplateColumns: columns, gap: 28, alignItems: 'center', background: T.paper, border: `1px solid ${T.line}`, borderRadius: 20, overflow: 'hidden', boxShadow: T.shadow, marginBottom: 20, ...style }}>
      <img src={photoSrc} alt={photoAlt} style={{ width: '100%', height: '100%', minHeight, objectFit: 'cover' }} />
      <div style={{ padding: 'clamp(24px,3vw,36px)' }}>
        <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(22px,2.6vw,30px)', color: T.forest, letterSpacing: '-0.02em' }}>{headline}</div>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ marginTop: i === 0 ? 14 : 12, fontSize: 16, color: T.inkSoft, lineHeight: 1.65 }}>{p}</p>
        ))}
      </div>
    </div>
  )
}

/* ─── Matched testimonial card ───────────────────────────────────────
   t: { name, stat, quote, frame }. Used on the quiz-result bucket pages
   to show a testimonial matched to where the reader scored.           */
export function MatchedTestimonialCard({ T, t, accent, eyebrowStyle, eyebrowLabel = 'Someone who scored where you are' }) {
  if (!t) return null
  return (
    <section style={{ margin: '44px 0' }}>
      <span style={eyebrowStyle}>{eyebrowLabel}</span>
      <div style={{ background: T.bone, border: `1px solid ${T.line}`, borderRadius: 16, padding: 'clamp(24px,3.5vw,36px)' }}>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: T.inkSoft, margin: '0 0 18px' }}>{t.frame}</p>
        <blockquote style={{ fontFamily: T.display, fontWeight: 700, fontSize: 'clamp(20px,2.6vw,26px)', lineHeight: 1.4, color: T.ink, margin: '0 0 18px', letterSpacing: '-0.01em' }}>“{t.quote}”</blockquote>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: T.ink }}>{t.name}</span>
          <span style={{ fontFamily: T.mono, fontSize: 13, letterSpacing: '.04em', color: accent }}>{t.stat}</span>
        </div>
      </div>
    </section>
  )
}

/* ─── Video testimonial grid ──────────────────────────────────────────
   Accepts either an array of Loom share IDs (strings) or an array of
   { loomId, name } objects. When a loomId is missing or starts with
   "PASTE_" it renders a placeholder tile instead of an iframe.         */
export function VideoTestimonialGrid({ videos, T, className, gridStyle, aspectRatio = '9 / 16', loomParams }) {
  return (
    <div className={className} style={gridStyle}>
      {videos.map((v, i) => {
        const { loomId, name } = typeof v === 'string' ? { loomId: v, name: `Client testimonial ${i + 1}` } : v
        const hasVideo = loomId && !loomId.startsWith('PASTE_')
        return (
          <div key={loomId || i} style={{ background: '#000', border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden', boxShadow: T.shadow, aspectRatio }}>
            {hasVideo ? (
              <iframe
                src={`https://www.loom.com/embed/${loomId}?${loomParams}`}
                title={name}
                frameBorder="0"
                allowFullScreen
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: T.mist, color: T.inkFaint, fontFamily: T.mono, fontSize: 12, textAlign: 'center', padding: 20 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={T.moss} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 30, height: 30 }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span style={{ fontWeight: 600, color: T.inkSoft }}>{name}</span>
                <span>Paste a Loom ID in VIDEO_TESTIMONIALS</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   LAB PROOF

   Same idea as FeaturedTransformation, but for lab/bloodwork screenshots
   instead of body photos: a before/after image pair plus a short message
   from the client about what changed.

   Example data shape, once you have real screenshots to import:

     import labBeforeDaniel from './assets/daniel-labs-before.png'
     import labAfterDaniel  from './assets/daniel-labs-after.png'

     const LAB_PROOFS = [
       {
         name: 'Daniel',
         stat: 'A1C 6.9 → 5.4 in 4 months',
         beforeSrc: labBeforeDaniel,
         afterSrc: labAfterDaniel,
         beforeLabel: 'Month 1',
         afterLabel: 'Month 4',
         message: "My doctor didn't believe the numbers at first. First time in ten years my A1C wasn't flagged.",
       },
     ]

   Then drop this anywhere on a page:

     import { LabProofGrid } from './proofUtils'
     <LabProofGrid proofs={LAB_PROOFS} T={T} />

   Leave beforeSrc/afterSrc unset on any entry and that side renders an
   "Add before/after-labs image" placeholder instead of a broken image,
   so you can write the entry before the screenshot exists.             */
export function LabProofCard({ T, name, stat, beforeSrc, afterSrc, beforeLabel = 'Before', afterLabel = 'After', message, minHeight = 300 }) {
  return (
    <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 20, overflow: 'hidden', boxShadow: T.shadow }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: T.line }}>
        <div style={{ position: 'relative' }}>
          {beforeSrc ? (
            <img src={beforeSrc} alt={`${name} before labs`} style={{ width: '100%', height: '100%', minHeight, objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ minHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.mist, color: T.inkFaint, fontFamily: T.mono, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'center', padding: 16 }}>Add before-labs image</div>
          )}
          <span style={{ position: 'absolute', top: 12, left: 12, fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: 'rgba(17,36,27,.72)', color: '#fff', padding: '4px 9px', borderRadius: 100 }}>{beforeLabel}</span>
        </div>
        <div style={{ position: 'relative' }}>
          {afterSrc ? (
            <img src={afterSrc} alt={`${name} after labs`} style={{ width: '100%', height: '100%', minHeight, objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ minHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.mist, color: T.inkFaint, fontFamily: T.mono, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'center', padding: 16 }}>Add after-labs image</div>
          )}
          <span style={{ position: 'absolute', top: 12, right: 12, fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: T.vital, color: T.forest, padding: '4px 9px', borderRadius: 100 }}>{afterLabel}</span>
        </div>
      </div>
      <div style={{ padding: 'clamp(22px,3vw,32px)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <b style={{ fontFamily: T.display, fontWeight: 800, fontSize: 20, color: T.forest }}>{name}</b>
          <span style={{ fontFamily: T.mono, fontSize: 12.5, color: T.moss }}>{stat}</span>
        </div>
        {message && <p style={{ marginTop: 14, fontSize: 15.5, color: T.inkSoft, lineHeight: 1.6 }}>“{message}”</p>}
      </div>
    </div>
  )
}

/* Grid wrapper for LabProofCard. Renders nothing until `proofs` has
   entries, so it's safe to leave imported-but-empty on a page.        */
export function LabProofGrid({ proofs, T, columns = 2, gap = 18, className, style }) {
  if (!proofs?.length) return null
  return (
    <div className={className} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns},1fr)`, gap, ...style }}>
      {proofs.map(p => <LabProofCard key={p.name} T={T} {...p} />)}
    </div>
  )
}
