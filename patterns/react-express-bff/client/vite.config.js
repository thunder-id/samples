import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The dev server forwards /api/auth to the BFF, so the app and the BFF share this origin and the
  // BFF's session cookie is first party.
  server: {
    proxy: {
      '/api/auth': { target: process.env.BFF_URL || 'http://localhost:3001' },
    },
  },
})
