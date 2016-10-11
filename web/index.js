if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(registration => {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(err => {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

// Logs a message to the page, and console.
function logMessage(message, isError) {
  // Insert a paragraph into the page.
  var logsDiv = document.querySelector('#logs');
  var p = document.createElement('p');
  logsDiv.appendChild(p);
  p.appendChild(document.createTextNode(message));
  if (isError)
    p.style.color = 'red';

  // Also log to the console.
  if (isError)
    console.error(message);
  else
    console.log(message);
}

window.addEventListener('beforeinstallprompt', e => {
  logMessage('Got beforeinstallprompt!!!');
  logMessage('platforms: ' + e.platforms);
  logMessage('Should I cancel it? Hmmmm .... ');

  if (Math.random() > 0.5) {
    logMessage('Yeah why not. Cancelled!');
    e.preventDefault();
    return;
  }

  logMessage('No, let\'s see the banner');
  logMessage('The promise is: ' + e.userChoice);
  window.setTimeout(() => {
    if (!e) {
      logMessage('No event????', true);
      return;
    }

    logMessage('Timer time!');
    e.userChoice.then(result => {
      logMessage('platform is: \'' + result.platform + '\'');
      logMessage('outcome is: \'' + result.outcome + '\'');
    }, () => {
      logMessage('Boo! an error', true);
    });
  }, 1000);
});
