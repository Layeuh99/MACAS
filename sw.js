/* Minimal service worker to avoid 404 in dev */
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Pass-through fetch (no caching)
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
