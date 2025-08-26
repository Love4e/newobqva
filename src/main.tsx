// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// регистрираме SW от public/, със съобразен base за GitHub Pages
if ('serviceWorker' in navigator) {
  const sw = `${import.meta.env.BASE_URL}ll-sw.js`;
  navigator.serviceWorker.register(sw).catch(console.warn);
}
