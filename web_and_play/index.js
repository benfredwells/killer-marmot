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
  }
  document.close();
});

window.addEventListener('load', async e => {
  if (navigator.getInstalledRelatedApps === undefined) {
    logMessage('navigator.getInstalledRelatedApps is undefined');
  } else {
    let relatedApps = await navigator.getInstalledRelatedApps();
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
