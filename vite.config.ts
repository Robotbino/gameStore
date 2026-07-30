import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The backend's CorsConfig allowlists exactly one origin,
    // http://localhost:5173. Vite's default behaviour on a busy port is to
    // quietly move to 5174, which still loads the app but makes every API call
    // fail CORS — and the browser reports that as an unreachable server, not as
    // the port problem it is. strictPort turns that into a loud startup failure.
    port: 5173,
    strictPort: true,
  },
})
