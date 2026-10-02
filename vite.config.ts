import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
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
        }],
      },
    }),
  ],
})
