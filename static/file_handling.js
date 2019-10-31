// Copyright 2019 Google Inc.
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

window.addEventListener('load', () => {
  if (!window.launchParams
    || !window.launchParams.files
    || !window.launchParams.files.length) {
    return;
  }

  // Ensure the section is visible.
  const fileHandlingSection = document.getElementById('file_handling_section');
  fileHandlingSection.classList.remove("hide");

  for (const launchedFile of window.launchParams.files)
    addFile(launchedFile);
});

const addFile = async (file) => {
  const readHandle = file.createWriter ? await file.getFile() : file;
  const writeHandle = file.createWriter ? file : undefined;

  const container = document.getElementById('launched_files_container');

  // Get the file editor template and populate it.
  const template = document.getElementById('launched_file_template');
  const element = template.content.cloneNode(true);

  const elementNameContainer = element.querySelector("[name='file_name']");
  elementNameContainer.innerText = readHandle.name;

  const elementContentContainer = element.querySelector("[name='file_contents']");
  elementContentContainer.innerText = "Loading...";

  const saveButton = element.querySelector("[name='save_button']");
  if (!writeHandle) saveButton.classList.add('hide');

  saveButton.addEventListener('click', async () => {
    const writer = await writeHandle.createWriter();
    await writer.write(0, new Blob([elementContentContainer.value]));
    await writer.truncate(elementContentContainer.value.length);
  });

  container.appendChild(element);

  try {
    const reader = new FileReader();
    reader.onload = (event) => {
      // When we've loaded the file, set the content to the file.
      elementContentContainer.value = event.target.result;
    }

    reader.readAsText(readHandle);
  } catch (err) {
    console.log(err);
  }
}
