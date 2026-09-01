export const dynamic = 'force-static'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* The post-call confirmation page is a conversion step, not content.
         It carries the same noindex in its own metadata. */
      disallow: ['/booked/'],
    },
    sitemap: 'https://lukestrassner.com/sitemap.xml',
  }
}
