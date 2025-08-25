import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// нужно за GitHub Pages (deploy в /lovelink-mvp/)
export default defineConfig({
  plugins: [react()],
  base: '/lovelink-mvp/',
})
