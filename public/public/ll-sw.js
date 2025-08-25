// Minimal Service Worker за GitHub Pages + Vite
// Инсталира се веднага и поема контрол, без агресивно кеширане.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// По желание: ако искаш базов offline fallback, разкоментирай това:
/*
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
*/
