import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/lovelink-mvp/', // ← името на репото (ако е друго, смени)
})
