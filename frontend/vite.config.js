import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // run frontend on port 3000
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // proxy backend calls to Flask default port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
