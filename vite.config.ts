import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ВАЖНО: базов път = името на репото
  base: '/lovelink-mvp/',
})
