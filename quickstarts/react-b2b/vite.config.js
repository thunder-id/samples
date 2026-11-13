import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// The app runs on https, like ThunderID, so the two are the same site. A switch to another company
// then reuses the ThunderID sign-in in a hidden frame instead of leaving the page.
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: { port: 5173, strictPort: true },
})
