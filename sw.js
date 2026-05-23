// sw.js

const CACHE_NAME = 'lab-8-starter';

// B6. Pre-cache all recipe URLs on install
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
      ]);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// B7 & B8. Cache-first strategy: serve from cache if available,
//          otherwise fetch from network and cache the response
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // B7. Open the cache
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (cachedResponse) {
        // B8. Return cached version if found
        if (cachedResponse) {
          return cachedResponse;
        }
        // Otherwise fetch from network, cache it, then return it
        return fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});