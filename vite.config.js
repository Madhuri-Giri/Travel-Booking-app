import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },

server: {
    proxy: {
      // This will proxy requests from /api to the target server
      '/api': {
        target: 'https://sajyatra.sajpe.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },


})

