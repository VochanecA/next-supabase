const STATIC_CACHE_NAME = 'ai-notify-static-v2';
const DYNAMIC_CACHE_NAME = 'ai-notify-dynamic-v2';

// ✅ Critical static assets (from layout.tsx)
const STATIC_ASSETS = [
  '/', // root shell
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/og-image.jpg',
  '/fonts/inter-var.woff2',
];

// 🧹 Limit cache size (LRU strategy)
async function limitCacheSize(name, maxItems) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    return limitCacheSize(name, maxItems);
  }
}

// ▶️ Install: cache app shell + critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ♻️ Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (![STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME].includes(name)) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// 🚀 Fetch: optimized strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // ✅ Fonts → stale-while-revalidate
  if (request.destination === 'font') {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request).then((res) => {
          cache.put(request, res.clone());
          return res;
        });
        return cached || networkFetch;
      })
    );
    return;
  }

  // ✅ Images → stale-while-revalidate (fast LCP)
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request).then((res) => {
          cache.put(request, res.clone());
          limitCacheSize(DYNAMIC_CACHE_NAME, 60);
          return res;
        });
        return cached || networkFetch;
      })
    );
    return;
  }

  // ✅ Navigations → shell-first, then update
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/').then((cachedPage) => {
        return fetch(request)
          .then((res) => {
            caches.open(DYNAMIC_CACHE_NAME).then((cache) =>
              cache.put(request, res.clone())
            );
            return res;
          })
          .catch(() => cachedPage || caches.match('/offline.html'));
      })
    );
    return;
  }

  // ✅ Default → network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(request, resClone);
          limitCacheSize(DYNAMIC_CACHE_NAME, 80);
        });
        return res;
      })
      .catch(() => caches.match(request))
  );
});
