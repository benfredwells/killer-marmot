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
  console.log('There was a fetch!!');
});

const delay = (time) => new Promise(accept => setTimeout(accept, time));

self.addEventListener('launch', event => {
  event.preventDefault();
  console.log('Prevent default: ', event.preventDefault);
  console.log("ermhagerd we fired the event!!!!!!!!");
  console.log(event);
  console.log(event.files);
  event.waitUntil(new Promise(async (accept) => {
    // Let the client window open...
    // TODO: Make the launch event properly trusted so we can open windows ourselves.
    await delay(1000);
    const allClients = await clients.matchAll({ includeUncontrolled: true });

    const client = allClients[0] || clients.openWindow('/');

    // We can't pass writable file handles, so pass the readable handle.
    const handle = event.files[0];
    let file = await handle.getFile();
    const writer = await handle.createWriter();
    await writer.write(file.size, new Blob(["Hello World Foo Bar\n"]))

    file = await handle.getFile();
    console.log("Passing", file, "to client!");

    client.postMessage({ files: [file], message: "Launch me!" });
    
    setTimeout(() => {
      console.log("done!");
      accept();
    }, 1000);
  }))
});
