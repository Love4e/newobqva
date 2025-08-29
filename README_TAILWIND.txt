Tailwind skin for NewObqva

1) Качи тези 3 файла в root/app:
   - tailwind.config.js
   - postcss.config.js
   - app/globals.css (заменя съществуващия)

2) Увери се, че имаш зависимости (вече ги добавихме в package.json):
   - tailwindcss, postcss, autoprefixer

3) В app/layout.tsx трябва да има:
   import './globals.css'

4) Deploy във Vercel.
