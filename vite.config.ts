import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8002,
    strictPort: false, // Allows Vite to try the next port if 8001 is busy[citation:5]
    open: true // Automatically opens the app in the browser on startup[citation:5]
  },
  preview: {
    port: 8002
  }
})