import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import './globals.css'

/* Every page previously injected this same stylesheet from a useEffect, which
   meant the fonts only arrived after hydration. Loading it here puts it in the
   served HTML, so text renders in the right face on first paint. */
const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'

export const metadata = {
  metadataBase: new URL('https://lukestrassner.com'),
  title: {
    default: 'Chainmover Coaching — Metabolic Health Coaching with Luke Strassner',
    template: '%s · Chainmover Coaching',
  },
  description:
    'Improve your labs, reduce your insulin resistance, and lose fat for the long term. 1-on-1 metabolic health coaching with Luke Strassner.',
  applicationName: 'Chainmover Coaching',
  authors: [{ name: 'Luke Strassner' }],
  creator: 'Luke Strassner',
  icons: { icon: '/chainmover-logo.png' },
  openGraph: {
    type: 'website',
    siteName: 'Chainmover Coaching',
    locale: 'en_US',
    images: ['/chainmover-logo.png'],
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        {/* /quiz and /metabolic use MUI, whose Emotion styles are generated
            during the build. Without a shared cache the class names the server
            emits and the ones the browser generates disagree, and hydration
            fails on those two pages. */}
        <AppRouterCacheProvider>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
