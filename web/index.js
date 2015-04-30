if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

e_copy = null;

window.addEventListener("beforeinstallprompt", function(e) {
  e_copy = e;
  document.open();
  document.write('Got beforeinstallprompt!!!<br>');
  document.write('platforms: ');
  document.write(e.platforms);
  document.write('<br>Should I cancel it? Hmmmm .... ');
  if (Math.random() > 0.5) {
    document.write('Yeah why not. Cancelled!');
    e.preventDefault();
  } else {
    document.write("No, let's see the banner");
    document.write("<br>The promise is: " + e_copy.userChoice);
    window.setTimeout(onTimer, 1000);
  }
  document.close();
});

function onTimer() {
  if (!e_copy) {
    document.write("No event????");
    return;
  }
  document.write("Timer time!<br>");
  e_copy.userChoice.then(function(result) {
    document.write("platform is: '" + result.platform + "'<br>");
    document.write("outcome is: '" + result.outcome + "'");
  }, function() {
    document.write('Boo! an error');
  });
}
