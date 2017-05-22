importScripts('serviceworker-cache-polyfill.js');

var CACHE_NAME = 'killer-marmot-v2';
var urlsToCache = [
//  'index.js',
//  'index.html'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Required to be installable.
self.addEventListener('fetch', function(event) {
});
