// Enable configuration definition
import { defineConfig } from 'vite'

// Enable React
import react from '@vitejs/plugin-react'

// Enable Progressive Web App to allow mobile use
import { VitePWA } from 'vite-plugin-pwa'

// Enable file I/O
import path from "path"

// Enable reading the package
import pkg from "./package.json" with { type: "json" }

// https://vite.dev/config/


export default defineConfig({
  plugins: [
    react(
  ),

    VitePWA({
      // Update automatically when you deploy a new build
      registerType: 'autoUpdate',

      // Enable SW during dev so you can test quickly
      devOptions: { enabled: true },

      // Web app manifest
      manifest: {
        name: 'My Bill Tracker',
        short_name: 'Bills',
        description: 'Track bills and payments on the go.',
        theme_color: '#0ea5e9',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/cutecat192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/cutecat512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/cutecat512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/cutecat180.png', sizes: '180x180', type: 'image/png' }
        ],
        shortcuts: [
          { name: 'Add Bill', short_name: 'Add Bill', url: '/#add' }
        ]
      },
      // Basic runtime caching (customize as you integrate Airtable later)
      workbox: {
        runtimeCaching: [
          // App shell / documents
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: { cacheName: 'html' }
          },
          // JS/CSS
          {
            urlPattern: ({ request }) => ['script','style','worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'static-resources' }
          },
          // Images
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
          // Later, add an Airtable rule with NetworkFirst
        ]
      }
    }
    )
  ],


  


  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_NAME__: JSON.stringify(pkg.name)
  },
})
