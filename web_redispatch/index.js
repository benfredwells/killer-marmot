if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

window.addEventListener("beforeinstallprompt", function(e) {
  var testEarly = (window.location.hash.indexOf("early") > -1);
  var isTooSoon = (window.location.hash.indexOf("redispatch") > -1);
  var testLate = (window.location.hash.indexOf("late") > -1);

  if (testEarly) {
    console.log("testing early");
    e.prompt().then(function() {
      console.log("testing early resolved");
    }, function(error) {
      console.log("testing early rejected");
      console.log(error);
    });
  }

  if (isTooSoon) {
    console.log("Delaying event!");
    e.preventDefault(); // Prevents prompt display
    // Prompt later instead:
    setTimeout(function() {
      isTooSoon = false;
      console.log("Dispatching event");
      e.prompt().then(function() {
        console.log("testing");
        e.userChoice.then(function(result) {
          console.log(result.platform);
          console.log(result.outcome);
        }, function(error) {
          console.log("user rejected");
          console.log(error);
        });
      }, function(error) {
        console.log("testing rejected");
        console.log(error);
      });
    }, 5000);
  }

  if (testLate) {
    console.log("testing late");
    setTimeout(function() {
      e.prompt().then(function() {
        console.log("testing late resolved");
      }, function(error) {
        console.log("testing late rejected");
        console.log(error);
      });
    }, 15000);
  }
});
