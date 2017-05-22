// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(registration => {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(err => {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

// Creates a promise that resolves after a given number of milliseconds.
function sleep(milliseconds) {
  return new Promise((resolve, reject) => {
      window.setTimeout(resolve, milliseconds);
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

// Logs a clickable link to the page. Returns a promise that resolves when the
// user clicks the link.
function logClickableLink(text) {
  // Insert a paragraph into the page.
  var logsDiv = document.querySelector('#logs');
  var p = document.createElement('p');
  logsDiv.appendChild(p);
  var a = document.createElement('a');
  p.appendChild(a);
  a.setAttribute('href', '');
  a.appendChild(document.createTextNode(text));

  return new Promise((resolve, reject) => {
    a.addEventListener('click', e => {
      e.preventDefault();
      resolve()
    });
  });
}

async function logUserChoice(e) {
  logMessage('userChoice is: ' + e.userChoice);
  await sleep(1000);
  if (!e) {
    logMessage('No event????', true);
    return;
  }

  logMessage('Timer time!');
  try {
    let {platform, outcome} = await e.userChoice;
    logMessage('platform is: \'' + platform + '\'');
    logMessage('outcome is: \'' + outcome + '\'');
  } catch (e) {
    logMessage('Boo! an error', true);
  }
}

window.addEventListener('beforeinstallprompt', async e => {
  logMessage('Got beforeinstallprompt!!!');
  logMessage('platforms: ' + e.platforms);
  logMessage('Should I cancel it? Hmmmm .... ');

  if (Math.random() > 0.5) {
    logMessage('Yeah why not. Cancelled!');
    e.preventDefault();
    await logClickableLink('Show the prompt after all.');
    try {
      await e.prompt();
      logMessage('prompt() resolved');
    } catch (ex) {
      logMessage('prompt() rejected with ' + ex, true);
    }
    logUserChoice(e);
    return;
  }

  logMessage('No, let\'s see the banner');
  logUserChoice(e);
});

window.addEventListener('appinstalled', e => {
  logMessage('Got appinstalled!!!');
});

async function showInstalledRelatedApps() {
  if (navigator.getInstalledRelatedApps === undefined) {
    logMessage('navigator.getInstalledRelatedApps is undefined');
    return;
  }

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

window.addEventListener('load', e => {
  showInstalledRelatedApps();
});
