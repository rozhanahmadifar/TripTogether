import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/netlify/functions': {
        target: 'http://localhost:8888/netlify/functions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/netlify\/functions/, ''),
      },
    },
  },
})
