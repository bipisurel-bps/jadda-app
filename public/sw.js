const CACHE_NAME = 'jadda-v4';
const URLS_TO_CACHE = [
  '/',
  '/sholat',
  '/doa',
  '/hadits',
  '/waris',
  '/zakat',
  '/umroh',
  '/haji',
  '/tentang',
  '/data/prayers.json',
  '/data/panduan-umroh.json',
  '/data/panduan-haji.json',
  '/data/hadits-arbain.json',
  '/favicon.svg',
  '/logo-jadda.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((resp) => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return resp;
      }).catch(() => caches.match('/'));
    })
  );
});
