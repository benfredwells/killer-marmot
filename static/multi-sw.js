importScripts('serviceworker-cache-polyfill.js');

// Note: There is no reason for this ServiceWorker to be it's own thing, we could just
// cache this stuff dynamically in the parent ServiceWorker, but this is used to test
// nested service workers.
let CACHE_NAME = 'killer-marmot-maskable-v1';
let urlsToCache = [
 'multi-sw.html',
 'style.css',
 'marmot_48.png',
 'marmot_96.png'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened maskable cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Required to be installable.
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request)
        .then(response => response || fetch(event.request)));
});
