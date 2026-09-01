import Link from 'next/link'

/* Static export writes this to out/404.html, which is the file GitHub Pages
   serves for an unknown path. The old SPA redirect trampoline in
   public/404.html is gone — every real route is now its own HTML file. */
export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

const T = {
  forest: '#143D2B',
  vital: '#46C98B',
  ink: '#11241B',
  inkSoft: '#46554D',
  display: '"Archivo","Helvetica Neue",Arial,sans-serif',
  body: '"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',
}

export default function NotFound() {
  return (
    <main
      style={{
        background: '#fff',
        color: T.ink,
        fontFamily: T.body,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        gap: 18,
      }}
    >
      <p style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: T.inkSoft, margin: 0 }}>
        404
      </p>
      <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 'clamp(28px,5vw,44px)', letterSpacing: '-0.03em', lineHeight: 1.08, margin: 0 }}>
        That page doesn&apos;t exist.
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: T.inkSoft, maxWidth: 460, margin: 0 }}>
        It may have moved, or the link may be wrong. The homepage is a good place to pick things back up.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 10,
          display: 'inline-block',
          background: T.vital,
          color: T.forest,
          fontFamily: T.display,
          fontWeight: 700,
          fontSize: 16,
          padding: '15px 30px',
          borderRadius: 100,
          textDecoration: 'none',
        }}
      >
        Back to the homepage
      </Link>
    </main>
  )
}
