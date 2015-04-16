if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

window.addEventListener("beforeinstallprompt", function(e) {
  document.open();
  document.append('Got beforeinstallprompt!!!');
  document.append(' Should I cancel it? Hmmmm .... '));
  if (Math.random() > 0.5) {
    document.write('Yeah why not. Cancelled!');
    e.preventDefault();
  } else {
    document.write('No, leti''s see the banner');
  }
  document.close();
});
