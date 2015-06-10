var testEarly = (window.location.hash == "#early");
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
  if (testEarly) {
    e.prompt().then(function(result)) {
      console.log("testing early " + result.outcome);
    }
  }
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
      e.prompt().then(function(result) {
        console.log(result.platform);
        console.log(result.outcome);
      });
    }, 5000);
  }
});

var testLate = (window.location.hash == "#late");
if (testLate) {
  setTimeout(function() {
    e.prompt().then(function(result)) {
      console.log("testing late" + result.outcome);
    }
  }, 15000);
}
