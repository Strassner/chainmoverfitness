import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  /* Vitest 4 transforms .jsx with oxc, which defaults to the automatic JSX
     runtime — the same one Next uses. Nothing to configure. */
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },

  test: {
    /* jsdom, not node: some of what we test reads sessionStorage or
       window.location, and the route-metadata tests read the filesystem. */
    environment: 'jsdom',
    include: ['tests/**/*.test.{js,jsx}'],
    globals: true,
  },
})
