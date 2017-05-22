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
  return createLogSectionInDiv(document.querySelector('#logs'), title);
}

async function logUserChoice(section, e) {
  logMessage(section, 'userChoice is: ' + e.userChoice);
  await sleep(1000);
  if (!e) {
    logMessage(section, 'No event????', true);
    return;
  }

  logMessage(section, 'Timer time!');
  try {
    let {platform, outcome} = await e.userChoice;
    logMessage(section, 'platform is: \'' + platform + '\'');
    logMessage(section, 'outcome is: \'' + outcome + '\'');
  } catch (e) {
    logMessage(section, 'Boo! an error', true);
  }
}

window.addEventListener('beforeinstallprompt', async e => {
  let logs = createLogSection('beforeinstallprompt');
  logMessage(logs, 'Got beforeinstallprompt!!!');
  logMessage(logs, 'platforms: ' + e.platforms);
  logMessage(logs, 'Should I cancel it? Hmmmm .... ');

  if (Math.random() > 0.5) {
    logMessage(logs, 'Yeah why not. Cancelled!');
    e.preventDefault();
    await logClickableLink(logs, 'Show the prompt after all.');
    try {
      await e.prompt();
      logMessage(logs, 'prompt() resolved');
    } catch (ex) {
      logMessage(logs, 'prompt() rejected with ' + ex, true);
    }
    logUserChoice(logs, e);
    return;
  }

  logMessage(logs, 'No, let\'s see the banner');
  logUserChoice(logs, e);
});

window.addEventListener('appinstalled', e => {
  let logs = createLogSection('appinstalled');
  logMessage(logs, 'Got appinstalled!!!');
});

async function showInstalledRelatedApps() {
  let logs = createLogSection('getInstalledRelatedApps');
  if (navigator.getInstalledRelatedApps === undefined) {
    logMessage(logs, 'navigator.getInstalledRelatedApps is undefined');
    return;
  }

  let relatedApps;
  try {
    relatedApps = await navigator.getInstalledRelatedApps();
  } catch (error) {
    logMessage(logs, 'getInstalledRelatedApps error: ' + error, true);
    return;
  }
  logMessage(logs, 'Installed related apps:');
  for (let i = 0; i < relatedApps.length; i++) {
    let app = relatedApps[i];
    text = `id: ${JSON.stringify(app.id)}, `
           + `platform: ${JSON.stringify(app.platform)}, `
           + `url: ${JSON.stringify(app.url)}`;
    logMessage(logs, text);
  }
}

window.addEventListener('load', e => {
  showInstalledRelatedApps();
});
