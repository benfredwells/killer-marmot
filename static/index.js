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

// Creates a new <div> for logs relating to a particular function.
function createLogSection(title) {
  return new LogSection(document.querySelector('#logs'), title);
}

// Get the current document's query parameters.
QUERY_PARAMS = {};
{
  for (const [n, v] of new URL(document.location).searchParams)
    QUERY_PARAMS[n] = v;
}

async function logUserChoice(section, e) {
  try {
    let {platform, outcome} = await e.userChoice;
    section.logMessage('platform is: \'' + platform + '\'');
    section.logMessage('outcome is: \'' + outcome + '\'');
  } catch (e) {
    section.logMessage('Boo! an error', true);
  }
}

window.addEventListener('beforeinstallprompt', async e => {
  let logs = createLogSection('beforeinstallprompt');
  logs.logMessage('Got beforeinstallprompt!!!');
  logs.logMessage('platforms: ' + e.platforms);
  const timer = QUERY_PARAMS.timer;
  logs.logMessage('Should I cancel it? Hmmmm .... ');

  if (timer === undefined) {
    logs.logMessage('Yeah why not. Cancelled!');
    e.preventDefault();
    await logs.logClickableLink('Show the prompt after all.');
    try {
      await e.prompt();
      logs.logMessage('prompt() resolved');
    } catch (ex) {
      logs.logMessage('prompt() rejected with ' + ex, true);
    }
    logUserChoice(logs, e);
    return;
  }

  if (timer > 0) {
    logs.logMessage(
        'No, let\'s see the banner in ' + timer +
        ' shakes of a marmot\'s tail.');
    await sleep(timer * 1000);
    logs.logMessage('Timer time!');
  } else {
    logs.logMessage('No, let\'s see the banner NOW.');
  }
  logUserChoice(logs, e);
});

window.addEventListener('appinstalled', e => {
  let logs = createLogSection('appinstalled');
  logs.logMessage('Got appinstalled!!!');
});

async function showInstalledRelatedApps() {
  let logs = createLogSection('getInstalledRelatedApps');
  if (navigator.getInstalledRelatedApps === undefined) {
    logs.logMessage('navigator.getInstalledRelatedApps is undefined');
    return;
  }

  let relatedApps;
  try {
    relatedApps = await navigator.getInstalledRelatedApps();
  } catch (error) {
    logs.logMessage('getInstalledRelatedApps error: ' + error, true);
    return;
  }
  logs.logMessage('Installed related apps:');
  for (let i = 0; i < relatedApps.length; i++) {
    let app = relatedApps[i];
    text = `id: ${JSON.stringify(app.id)}, `
           + `platform: ${JSON.stringify(app.platform)}, `
           + `url: ${JSON.stringify(app.url)}`;
    logs.logMessage(text);
  }
}

window.addEventListener('load', e => {
  showInstalledRelatedApps();

  // Set "continue" URL for POST-and-redirect button.
  let continueUrl = new URL(document.location);
  continueUrl.hash = '';
  document.querySelector('#continue_field').value = continueUrl;

  if (document.location.hash == '#cameBack') {
    document.querySelector('#cameback').style.display = 'block';
  }
});
