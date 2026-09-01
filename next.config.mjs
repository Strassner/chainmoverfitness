/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Every route is rendered to real HTML at build time and written to `out/`.
     No Node server is involved, so this still deploys to GitHub Pages — but a
     crawler now receives the full page instead of an empty div. */
  output: 'export',

  /* GitHub Pages serves directories, not extensionless files: `out/apply/`
     needs to be `apply/index.html` for https://lukestrassner.com/apply to work. */
  trailingSlash: true,

  /* The Image Optimization API needs a server. Static imports still get
     content-hashed filenames, they just aren't resized on the fly. */
  images: { unoptimized: true },
}

export default nextConfig
