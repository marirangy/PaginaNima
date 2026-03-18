import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Exporta la configuración de Vite
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      // Esto sirve en desarrollo para redirigir llamadas a tu backend
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
})