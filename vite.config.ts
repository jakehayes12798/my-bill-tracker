import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import pkg from "./package.json" with { type: "json" }

// https://vite.dev/config/


export default defineConfig({
  plugins: [react()],

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
