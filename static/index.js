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
// Expected query parameters:
// - action={'none', 'cancel', 'preempt', 'auto', 'manual'}: beforeinstallprompt
//          behavior.
//     none: do nothing.
//     cancel: call preventDefault().
//     preempt: call prompt() without preventDefault().
//     auto: call preventDefault(), wait, then call prompt().
//     manual (default): call preventDefault(), then add a button which calls
//         prompt().
// - timer=<int>: time to wait in seconds, if action is 'preempt' or 'auto'.
QUERY_PARAMS = {};
{
  for (const [n, v] of new URL(document.location).searchParams)
    QUERY_PARAMS[n] = v;

  // Set defaults.
  if (!QUERY_PARAMS.action)
    QUERY_PARAMS.action = 'manual';
  if (!QUERY_PARAMS.timer)
    QUERY_PARAMS.timer = 1;
}

window.addEventListener('beforeinstallprompt', async e => {
  let logs = createLogSection('beforeinstallprompt');
  logs.logMessage(
      'Got beforeinstallprompt! {platforms: ' + JSON.stringify(e.platforms) +
      '}');

  const action = QUERY_PARAMS.action;
  const timer = QUERY_PARAMS.timer;

  if (action !== 'none' && action !== 'preempt') {
    logs.logMessage('Calling preventDefault().');
    e.preventDefault();
  }

  if (action === 'manual') {
    await logs.logClickableLink('Show the prompt after all.');
  } else if (action === 'auto' && timer > 0) {
    logs.logMessage(`Sleeping for ${timer} second${timer == '1' ? '' : 's'}.`);
    await sleep(timer * 1000);
  }

  if (action === 'preempt' || action === 'auto' || action === 'manual') {
    if (action !== 'manual')
      logs.logMessage('Explicitly calling prompt().');
    try {
      const r = await e.prompt();
      if (r === e.userChoice)
        r = '[userChoice promise]';
      logs.logMessage('prompt() resolved: ' + r);
    } catch (ex) {
      logs.logMessage('prompt() rejected: ' + ex, true);
    }
  }

  try {
    let {platform, outcome} = await e.userChoice;
    logs.logMessage(
        `userChoice resolved: \{platform: ${JSON.stringify(platform)}, ` +
        `outcome: ${JSON.stringify(outcome)}\}`);
  } catch (e) {
    logs.logMessage('userChoice rejected: ' + e, true);
  }
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

  document.querySelector('#bip_' + QUERY_PARAMS.action).checked = true;
  document.querySelector('#bip_timer').value = QUERY_PARAMS.timer;

  setupBadgeSection();
  setupNavigationSection();

  window.launchParams && window.launchParams.files.forEach(addLaunchedFile);
});

const setupBadgeSection = () => {
  const badgeSection = document.querySelector('#badge_section');
  const badgeAPI = window.Badge || window.ExperimentalBadge;

  if (!badgeSection) {
    return;
  }
  // Check that the API is available.
  if (!badgeAPI) {
    console.log("Badge API not detected :'(");

    // If the Badging API is not available, hide the section.
    badgeSection.remove();
    return;
  }

  const setBadgeButton = document.querySelector('#set_badge');
  setBadgeButton.addEventListener('click', () => {
    const badgeContent = document.querySelector('#badge_content').value;
    // If the badge content is empty set a flag.
    if (badgeContent === '') {
      badgeAPI.set();
    }
    // Otherwise, set the badge to our badge content.
    else {
      badgeAPI.set(badgeContent);
    }
  });

  const clearBadgeButton = document.querySelector('#clear_badge');
  clearBadgeButton.addEventListener('click', badgeAPI.clear);
};

const setupNavigationSection = () => {
  const storageKey = 'last-navigate-url';

  const navigateButton = document.querySelector('#navigate_button');
  const navigateInput = document.querySelector('#navigate_url');
  const lastSeenValue = localStorage.getItem(storageKey);
  navigateInput.setAttribute('value', lastSeenValue || 'example.com');

  const doNavigation = () => {
    let url = navigateInput.value;
    localStorage.setItem(storageKey, url);

    if (url.indexOf('://') === -1) url = 'http://' + url;

    window.location = url;
  };

  navigateButton.addEventListener('click', doNavigation);
  navigateInput.addEventListener('keypress', event => event.keyCode === 13 && doNavigation());
}

const addLaunchedFile = async (file) => {
  let readHandle = file.createWriter ? await file.getFile() : file;
  let writeHandle = file.createWriter ? file : undefined;

  const section = document.getElementById('file_handling_section');
  // Ensure the container is visible.
  section.classList.remove("hide");

  const container = document.getElementById('launched_files_container');
  const template = document.getElementById('launched_file_template');
  const element = template.content.cloneNode(true);

  const elementNameContainer = element.querySelector("[name='file_name']");
  elementNameContainer.innerText = readHandle.name;

  const elementContentContainer = element.querySelector("[name='file_contents']");
  elementContentContainer.innerText = "Loading...";

  const saveButton = element.querySelector("[name='save_button']");
  if (!writeHandle) saveButton.classList.add('hide');

  saveButton.addEventListener('click', async () => {
    let writer = await writeHandle.createWriter();
    console.log(elementContentContainer.value);
    await writer.write(0, new Blob([elementContentContainer.value]));
    await writer.truncate(elementContentContainer.value.length);
  });
  
  container.appendChild(element);
  
  const reader = new FileReader();
  reader.onload = (event) => {
    // When we've loaded the file, set the content to the file.
    elementContentContainer.value = event.target.result;
  }
  reader.readAsText(readHandle);
}

window.navigator.serviceWorker.addEventListener("message", event => {
  if (!event.data.files)
    return;
  console.log("Launched by SW!!");
  event.data.files.forEach(addLaunchedFile);
});