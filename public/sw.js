const CACHE_NAME = 'hexatrack-v2';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/icon.png',
  '/logo.png',
  '/logo-dark.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  // Exclude APIs, browser extensions, and non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        // If cache has it, return cache. Otherwise throw standard fetch err or return dummy response
        if (cachedResponse) return cachedResponse;
        
        // Construct basic fallback Response object to prevent "Failed to convert to Response" crash
        return new Response('Network unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' }),
        });
      });
    })
  );
});


