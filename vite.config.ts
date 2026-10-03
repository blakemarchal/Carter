import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Each build gets an id. The app has it baked in, and dist/version.json publishes it, so an
// installed app can tell when a newer version has been deployed (see src/lib/update.ts).
const BUILD_ID = new Date().toISOString()

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [
    react(),
    {
      name: 'version-file',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD_ID }) })
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: "Carter's Ark Adventure",
        short_name: "Carter's Ark",
        description: 'A faith-based learning adventure for Carter',
        theme_color: '#ff6fae',
        background_color: '#fff0f7',
        display: 'fullscreen',
        orientation: 'landscape',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,mp3,m4a,webp,woff2}'],
        // Sing-along songs are big: each is kept the first time it's played (below), not up front.
        globIgnores: ['**/music/**'],
        // /login must reach the server (it shows the sign-in form when the login has expired).
        navigateFallbackDenylist: [/^\/login/],
        // Narration clips: keep every line the narrator has said, so it plays instantly (and offline) next time.
        runtimeCaching: [{
          urlPattern: ({ url }) => url.pathname === '/tts',
          handler: 'CacheFirst',
          options: {
            cacheName: 'narration',
            expiration: { maxEntries: 3000 },
            cacheableResponse: { statuses: [200] },
          },
        }, {
          // Song files have their version in the name (or ?v=), so a kept copy never goes stale.
          urlPattern: ({ url }) => url.pathname.startsWith('/music/') || /^\/songs\/[^/]+\/audio$/.test(url.pathname),
          handler: 'CacheFirst',
          options: {
            cacheName: 'songs',
            expiration: { maxEntries: 40 },
            cacheableResponse: { statuses: [200] },
          },
        }],
      },
    }),
  ],
})
