if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
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

window.addEventListener("beforeinstallprompt", function(e) {
  logMessage('Got beforeinstallprompt!!!<br>');
  logMessage('platforms: ');
  logMessage(e.platforms);
  logMessage('<br>Should I cancel it? Hmmmm .... ');
  if (Math.random() > 0.5) {
    logMessage('Yeah why not. Cancelled!');
    e.preventDefault();
  } else {
    logMessage("No, let's see the banner");
  }
});

window.addEventListener('load', async e => {
  if (navigator.getInstalledRelatedApps === undefined) {
    logMessage('navigator.getInstalledRelatedApps is undefined');
  } else {
    let relatedApps;
    try {
      relatedApps = await navigator.getInstalledRelatedApps();
    } catch (error) {
      logMessage('getInstalledRelatedApps error: ' + error, true);
      return;
    }
    logMessage('Installed related apps:');
    for (let i = 0; i < relatedApps.length; i++) {
      let app = relatedApps[i];
      text = `id: ${JSON.stringify(app.id)}, `
             + `platform: ${JSON.stringify(app.platform)}, `
             + `url: ${JSON.stringify(app.url)}`;
      logMessage(text);
    }
  }
});
