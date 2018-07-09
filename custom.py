# Copyright 2018 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import collections

import app_data
import base64
import json


def get_template_params(manifest_string):
    """Get the template parameters for a custom app page."""
    params = app_data.APPS['web'].copy()
    params['viewport'] = app_data.DEFAULT_VIEWPORT
    params['explanation'] = 'The manifest is customized via the URL.'
    params['short_explanation'] = 'Custom app'
    params['custom_manifest'] = manifest_string
    return params


def build_custom_manifest(b64manifest, insert_icons=False):
    """Creates a manifest from a URL-safe-base-64-encoded manifest string.

    Returns (HTTP status code, body).
    """
    # Decode from URL-safe-base-64 to UTF-8 bytes.
    try:
      manifest_original_bytes = base64.urlsafe_b64decode(b64manifest)
    except TypeError:
      return 400, 'Invalid base-64-encoded manifest.'

    # Decode from UTF-8 bytes to JSON string.
    try:
      manifest_original = manifest_original_bytes.decode('utf-8')
    except UnicodeDecodeError:
      return 400, 'Invalid UTF-8-encoded manifest.'

    # Parse JSON string as JSON object.
    try:
      manifest = json.loads(manifest_original,
                            object_pairs_hook=collections.OrderedDict)
    except ValueError:
      return 400, 'Invalid JSON for manifest.'

    # Insert default icons if none included.
    if insert_icons and 'icons' not in manifest:
      manifest['icons'] = app_data.DEFAULT_ICONS

    # Basic validation to make sure a user can't create a URL that runs unknown
    # code, then send the link to other users.
    if 'serviceworker' in manifest:
      return 400, 'Custom manifest cannot have "serviceworker".'

    # Re-encode JSON so that it is formatted nicely.
    return 200, json.dumps(manifest, indent=2, separators=(',', ': ')) + '\n'


def encode_manifest(manifest_string):
    """Creates a URL-safe-base-64-encoded manifest string from a full manifest.

    Raises a ValueError if the string is not valid JSON.
    """
    manifest = json.loads(manifest_string,
                          object_pairs_hook=collections.OrderedDict)
    manifest_minified = json.dumps(manifest)
    return base64.urlsafe_b64encode(manifest_minified)
