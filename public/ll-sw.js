// public/ll-sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
/* Offline fallback (по желание) – виж коментара в предния вариант */
