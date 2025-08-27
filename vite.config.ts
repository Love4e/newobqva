import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // важно за GitHub Pages – base трябва да е името на repo-то
  base: '/lovelink-mvp/'
})
