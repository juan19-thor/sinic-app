import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En GitHub Pages el repo se sirve desde /nombre-repo/
// Cambia 'sinic-app' al nombre exacto de tu repositorio en GitHub
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'sinic-app'

export default defineConfig({
  plugins: [react()],
  // base: en dev usa '/', en build para Pages usa '/nombre-repo/'
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
})
