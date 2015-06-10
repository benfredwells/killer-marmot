if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

var testEarly = (window.location.hash == "#early");
var isTooSoon = (window.location.hash == "#redispatch");
var testLate = (window.location.hash == "#late");
window.addEventListener("beforeinstallprompt", function(e) {
  console.log(e);

  if (testEarly) {
    e.prompt().then(function(result) {
      console.log("testing early " + result.outcome);
    });
  }

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

  if (testLate) {
    setTimeout(function() {
      e.prompt().then(function(result) {
        console.log("testing late" + result.outcome);
      });
    }, 15000);
  }
});

