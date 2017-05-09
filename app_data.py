# Copyright 2017 Google Inc.
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

"""This file defines the metadata for each app (used by the templating system).
"""

# HTML defaults.
DEFAULT_VIEWPORT = 'width=device-width, initial-scale=1'

# Manifest defaults.
DEFAULT_NAME = 'Killer Marmot'
DEFAULT_SHORT_NAME = 'Marmot'
DEFAULT_START_URL = 'index.html'
DEFAULT_DISPLAY = 'standalone'
DEFAULT_ICONS = [
    {
        'src': '../marmot.png',
        'sizes': 'any',
        'type': 'image/png',
        'density': 1
    }, {
        'src': '../marmot_48.png',
        'sizes': '48x48',
        'type': 'image/png',
        'density': 1
    }, {
        'src': '../marmot_96.png',
        'sizes': '96x96',
        'type': 'image/png',
        'density': 1
    }, {
        'src': '../marmot_128.png',
        'sizes': '128x128',
        'type': 'image/png',
        'density': 1
    }, {
        'src': '../marmot_200.png',
        'sizes': '200x200',
        'type': 'image/png',
        'density': 1
    }, {
        'src': '../marmot_480.png',
        'sizes': '480x480',
        'type': 'image/png',
        'density': 1
    },
]

# Each app is represented by a dictionary with the following optional fields:
# - description: String description of the app.
# - index_js: Boolean; whether to load index.js.
# - manifest_json: Boolean; whether to link to manifest.json.
# - viewport: String value for the viewport meta tag. If omitted, no tag. Can
#   use DEFAULT_VIEWPORT.
# - referrer: Boolean; whether to include a referrer meta tag.
# - web_stuff: Boolean; whether to include name, short_name, icons, display and
#   start_url. Can be overridden by other fields.
# - icons: Boolean; whether to include icons in manifest.
# - display: String; display field for manifest. None for no display.
APPS = {
    'ios_and_play': {
        'description': 'Site with a related iOS and play app in the manifest.',
        'manifest_json': True,
    },

    'ios_and_web': {
        'description': 'Site which is a valid web app, but has a preferred iOS app '
                       'in its manifest.',
        'index_js': True,
        'manifest_json': True,
        'web_stuff': True,
    },

    'ios': {
        'description': 'Site with a related iOS app in the manifest.',
        'manifest_json': True,
    },

    'none': {
        'description': 'Site with no manifest.',
        'index_js': True,
    },

    'play_and_ios': {
        'description': 'Site with a related play app, and iOS app, in its '
                       'manifest.',
        'manifest_json': True,
    },

    'play_and_web': {
        'description': 'Site which is a valid web app, but has a preferred play '
                       'app in its manifest.',
        'index_js': True,
        'manifest_json': True,
        'web_stuff': True,
    },

    'play': {
        'description': 'Site with a related play app in the manifest.',
        'manifest_json': True,
    },

    'play_non_google_link_referrer': {
        'description': 'Site with a related play app (non-Play-Store referrer) '
                       'in the manifest.',
        'manifest_json': True,
        'referrer': True,
    },

    'play_referrer': {
        'description': 'Site with a related play app (Play Store referrer) in '
                       'the manifest.',
        'manifest_json': True,
        'referrer': True,
    },

    'web': {
        'description': 'Site which is a valid web app.',
        'index_js': True,
        'manifest_json': True,
        'viewport': DEFAULT_VIEWPORT,
        'web_stuff': True,
    },

    'web_and_ios': {
        'description': 'Site which is a valid web app, and also with a '
                       'non-preferred iOS app in its manifest.',
        'index_js': True,
        'manifest_json': True,
        'viewport': DEFAULT_VIEWPORT,
        'web_stuff': True,
    },

    'web_and_play': {
        'description': 'Site which is a valid web, and also with a non-preferred '
                       'play app in its manifest.',
        'index_js': True,
        'manifest_json': True,
        'viewport': DEFAULT_VIEWPORT,
        'web_stuff': True,
    },

    'web_broken': {
        'description': 'Site which is a broken web app.',
        'index_js': True,
        'manifest_json': True,
        'viewport': 'minimum-scale=0.6, maximum-scale=5.0, '
                    'user-scalable=fixed, INITIAL-SCALE=1.0, '
                    'width=device-width',
        'web_stuff': True,
        'icons': False,
        'display': None,
    },

    'web_no_meta_viewport': {
        'description': 'Site which is missing a viewport.',
        'index_js': True,
        'manifest_json': True,
        'web_stuff': True,
    },

    'web_redispatch': {
        'description': 'Site which is a valid web app.',
        'index_js': True,
        'manifest_json': True,
        'viewport': DEFAULT_VIEWPORT,
        'web_stuff': True,
    },
}
