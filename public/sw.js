// Minimal service worker: no offline caching, it exists purely so Chrome
// considers the site "installable" (its PWA installability check looks for
// a registered service worker with a fetch handler, in addition to the
// manifest). Falls through to the network for every request.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', () => {})
