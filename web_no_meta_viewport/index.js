if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

var isTooSoon = (window.location.hash == "#redispatch");
window.addEventListener("beforeinstallprompt", function(e) {
  console.log(e);
  if (isTooSoon) {
    e.preventDefault(); // Prevents prompt display
    console.log("Delaying event!");
    // Prompt later instead:
    setTimeout(function() {
      isTooSoon = false;
      console.log("Dispatching event");
      e.prompt() // Shows prompt
      console.log(e);
    }, 5000);
  }
});
