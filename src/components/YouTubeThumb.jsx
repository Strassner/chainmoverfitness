'use client'

/* YouTube only generates maxresdefault.jpg for videos uploaded above 720p, so
   the request 404s on older uploads and leaves a broken image. Falling back to
   hqdefault needs an onError handler, which needs a client component.

   It lives in its own file so the pages that use it — /carbs, /sleep,
   /visceralfat — stay server components and ship no JavaScript of their own. */
export default function YouTubeThumb({ videoId, alt, style }) {
  return (
    <img
      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
      onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }}
      alt={alt}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
    />
  )
}
