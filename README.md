# LoveLink MVP (clean setup)

- Vite + React + TS
- GitHub Pages at `/lovelink-mvp/`
- SPA fallback auto: `dist/404.html` copied from `dist/index.html`
- Safe Supabase init (won't crash if secrets are missing)

## Local dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy
Push to `main` (GitHub Actions does the rest).
