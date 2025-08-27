import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ЗАДЪЛЖИТЕЛНО: base да сочи към името на repo-то за GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/lovelink-mvp/',
})
