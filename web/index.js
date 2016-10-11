if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(registration => {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(err => {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

window.addEventListener('beforeinstallprompt', e => {
  document.open();
  document.write('Got beforeinstallprompt!!!<br>');
  document.write('platforms: ');
  document.write(e.platforms);
  document.write('<br>Should I cancel it? Hmmmm .... ');

  if (Math.random() > 0.5) {
    document.write('Yeah why not. Cancelled!');
    e.preventDefault();
    document.close();
    return;
  }

  document.write('No, let\'s see the banner');
  document.write('<br>The promise is: ' + e.userChoice);
  window.setTimeout(() => {
    if (!e) {
      document.write('No event????');
      document.close();
      return;
    }

    document.write('Timer time!<br>');
    e.userChoice.then(result => {
      document.write('platform is: \'' + result.platform + '\'<br>');
      document.write('outcome is: \'' + result.outcome + '\'');
    }, () => {
      document.write('Boo! an error');
    });

    document.close();
  }, 1000);
});
