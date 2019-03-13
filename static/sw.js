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

self.addEventListener('launch', event => {
  event.preventDefault();
  console.log('Prevent default: ', event.preventDefault);
  console.log("ermhagerd we fired the event!!!!!!!!");
  console.log(event);
  console.log(event.files);
  event.waitUntil(new Promise(async (accept) => {
    const file = await event.files[0].getFile();
    console.log(file);

    const reader = await new FileReader();
    reader.onload = async readEvent => {
      console.log('File Contents: ', readEvent.target.result);

      const writer = await event.files[0].createWriter();
      console.log(writer);
      await writer.write(file.size, new Blob(['FooBarHelloWorld\n']));
    }
    reader.readAsText(file);
    
    setTimeout(() => {
      console.log("done! doine");
      accept();
    }, 1000);
  }))
});
