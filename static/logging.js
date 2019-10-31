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

class LogSection {
  // Creates a new <div> for logs relating to a particular function.
  // If logsDiv is an existing log-section class, just creates a LogSection
  // object for that existing <div>, rather than creating a new <div>.
  constructor(logsDiv, title) {
    if (logsDiv.classList.contains('log-section')) {
      this.div = logsDiv;
      return;
    }

    this.div = document.createElement('div');
    logsDiv.appendChild(this.div);
    this.div.className = 'log-section';

    let titleH2 = document.createElement('h2');
    this.div.appendChild(titleH2);
    titleH2.appendChild(document.createTextNode(title));
  }

  // Logs a message to the given section, and console.
  logMessage(message, isError) {
    // Insert a paragraph into the section.
    var p = document.createElement('p');
    this.div.appendChild(p);
    p.appendChild(document.createTextNode(message));
    if (isError)
      p.className = 'error';

    // Also log to the console.
    if (isError)
      console.error(message);
    else
      console.log(message);
  }

  // Logs a clickable link to the given section. Returns a promise that resolves
  // when the user clicks the link.
  logClickableLink(text) {
    // Insert a paragraph into the section.
    var p = document.createElement('p');
    this.div.appendChild(p);
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
}
