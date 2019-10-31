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

import collections
import copy
import os.path

# HTML defaults.
DEFAULT_INDEX_JS = 'index.js'
DEFAULT_VIEWPORT = 'width=device-width, initial-scale=1'

# Manifest defaults.
DEFAULT_NAME = 'Killer Marmot'
DEFAULT_SHORT_NAME = 'Marmot'
DEFAULT_DESCRIPTION = ('A Progressive Web App for testing Progressive Web App '
                       'support across various browsers.')
DEFAULT_START_URL = '.'
DEFAULT_DISPLAY = 'standalone'
DEFAULT_FILE_HANDLER = {
    'action': '.',
    'files': [
        {
            'name': 'Marmot',
            'accept': [
                '.marmot',
                'application/vnd.marmot'
            ]
        }
    ]
}
RELATED_APP_PLAY = collections.OrderedDict([
    ('platform', 'play'),
    ('id', 'com.google.samples.apps.iosched'),
])
RELATED_APP_PLAY_REAL = collections.OrderedDict([
    ('platform', 'play'),
    ('id', 'io.github.benfredwells.killermarmot'),
])
RELATED_APP_PLAY_REFERRER = collections.OrderedDict([
    ('platform', 'play'),
    ('url', 'https://play.google.com/store/apps/details?'
            'id=com.google.samples.apps.iosched&'
            'referrer=utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_term%3D'
            'podcast%252Bapps%26utm_content%3DdisplayAd1%26utm_campaign%3D'
            'podcast%252Bgeneralkeywords'),
    ('id', 'com.google.samples.apps.iosched'),
])
RELATED_APP_PLAY_NON_GOOGLE_REFERRER = collections.OrderedDict([
    ('platform', 'play'),
    ('url', 'http://a.localytics.com/android?id=com.google.samples.apps.iosched'
            '&referrer=utm_source%3Dother_app_banners_local%26utm_campaign%3D'
            'AppBanners%2520Local'),
     ('id', 'com.google.samples.apps.iosched'),
])
RELATED_APP_PLAY_INSTANT = collections.OrderedDict([
    ('platform', 'play'),
    ('id', 'instantapp'),
])
RELATED_APP_PLAY_INSTANT_HOLDBACK = collections.OrderedDict([
    ('platform', 'play'),
    ('id', 'instantapp:holdback'),
])
RELATED_APP_IOS = collections.OrderedDict([
    ('platform', 'ios'),
    ('url', 'https://itunes.apple.com/us/app/google-i-o-2017/id1109898820'),
])


def make_icons(name='marmot', broken_sizes=False):
  """Makes the icons dict."""
  icons = []
  for size in (None, 48, 96, 128, 200, 480, 512):
    size_suffix = '' if size is None else '_%d' % size
    sizes = ('any' if size is None else
             '%d' % size if broken_sizes else
             '%dx%d' % (size, size))
    icon_dict = collections.OrderedDict([
        ('src', '%s%s.png' % (name, size_suffix)),
        ('sizes', sizes),
        ('type', 'image/png'),
        ('density', 1),
    ])
    icons.append(icon_dict)
  return icons


DEFAULT_ICONS = make_icons()

# Special case: Add the "maskable" icon.
DEFAULT_ICONS.append(collections.OrderedDict([
    ('src', 'maskable.png'),
    ('sizes', '432x432'),
    ('type', 'image/png'),
    ('purpose', 'maskable'),
    ('density', 1),
]))


# Each app is represented by a dictionary with the following optional fields:
# - explanation: String explanation of the app (used in the HTML pages, not the
#   manifest).
# - index_js: String filename of index.js. If omitted, no script. Can use
#   DEFAULT_INDEX_JS.
# - manifest_json: Boolean; whether to link to manifest.json.
# - viewport: String value for the viewport meta tag. If omitted, no tag. Can
#   use DEFAULT_VIEWPORT.
# - referrer: Boolean; whether to include a referrer meta tag.
# - web_stuff: Boolean; whether to include default viewport in index.html, and
#   default name, short_name, icons, display and start_url in the manifest. Can
#   be overridden by other fields.
# - icons: List of dicts; manifest member.
# - display: String; display field for manifest. None for no display.
# - prefer_related_applications: Boolean; manifest member.
# - related_applications: List of dicts; manifest member.
APPS = {
    'ios_and_play': {
        'explanation': 'Site with a related iOS and play app in the manifest.',
        'short_explanation': 'iOS app, also a play app',
        'manifest_json': True,
        'prefer_related_applications': True,
        'related_applications': [RELATED_APP_IOS, RELATED_APP_PLAY],
    },

    'ios_and_web': {
        'explanation': 'Site which is a valid web app, but has a preferred iOS app '
                       'in its manifest.',
        'short_explanation': 'iOS app, also a valid web app',
        'index_js': DEFAULT_INDEX_JS,
        'manifest_json': True,
        'web_stuff': True,
        'prefer_related_applications': True,
        'related_applications': [RELATED_APP_IOS],
    },

    'ios': {
        'explanation': 'Site with a related iOS app in the manifest.',
        'short_explanation': 'iOS app',
        'manifest_json': True,
        'prefer_related_applications': True,
        'related_applications': [RELATED_APP_IOS],
    },

    'none': {
        'explanation': 'Site with no manifest.',
        'short_explanation': 'No related apps',
        'index_js': DEFAULT_INDEX_JS,
    },

    'play_and_ios': {
        'explanation': 'Site with a related play app, and iOS app, in its '
                       'manifest.',
        'short_explanation': 'Play app, with iOS app as well',
        'manifest_json': True,
        'prefer_related_applications': True,
        'related_applications': [RELATED_APP_PLAY, RELATED_APP_IOS],
    },

    'play_and_web': {
        'explanation': 'Site which is a valid web app, but has a preferred play '
                       'app in its manifest.',
        'short_explanation': 'Play app, also a valid web app',
        'index_js': DEFAULT_INDEX_JS,
        'manifest_json': True,
        'web_stuff': True,
        'prefer_related_applications': True,
        'related_applications': [RELATED_APP_PLAY],
    },

    'play': {
        'explanation': 'Site with a related play app in the manifest.',
        'short_explanation': 'Play app',
        'manifest_json': True,
        'index_js': DEFAULT_INDEX_JS,
        'prefer_related_applications': True,
        'related_applications': [RELATED_APP_PLAY],
    },

    'play_instantapp': {
        'explanation': 'Site with a related play instant app in the manifest.',
        'short_explanation': 'Play instant app',
        'manifest_json': True,
        'index_js': DEFAULT_INDEX_JS,
        'prefer_related_applications': True,
        'related_applications': [RELATED_APP_PLAY_REAL,
                                 RELATED_APP_PLAY_INSTANT,
                                 RELATED_APP_PLAY_INSTANT_HOLDBACK],
    },

    'play_non_google_link_referrer': {
        'explanation': 'Site with a related play app (non-Play-Store referrer) '
                       'in the manifest.',
        'short_explanation': 'Play app with non-Google referrer',
        'manifest_json': True,
        'index_js': DEFAULT_INDEX_JS,
        'referrer': True,
        'prefer_related_applications': True,
        'related_applications': [RELATED_APP_PLAY_NON_GOOGLE_REFERRER],
    },

    'play_referrer': {
        'explanation': 'Site with a related play app (Play Store referrer) in '
                       'the manifest.',
        'short_explanation': 'Play app with referrer',
        'manifest_json': True,
        'index_js': DEFAULT_INDEX_JS,
        'referrer': True,
        'prefer_related_applications': True,
        'related_applications': [RELATED_APP_PLAY_REFERRER],
    },

    'web': {
        'explanation': 'Site which is a valid web app.',
        'short_explanation': 'Web app',
        'index_js': DEFAULT_INDEX_JS,
        'manifest_json': True,
        'web_stuff': True,
    },

    'web_and_ios': {
        'explanation': 'Site which is a valid web app, and also with a '
                       'non-preferred iOS app in its manifest.',
        'short_explanation': 'Web app, with iOS app as well',
        'index_js': DEFAULT_INDEX_JS,
        'manifest_json': True,
        'web_stuff': True,
        'related_applications': [RELATED_APP_IOS],
    },

    'web_and_play': {
        'explanation': 'Site which is a valid web, and also with a non-preferred '
                       'play app in its manifest.',
        'short_explanation': 'Web app, with play app as well',
        'index_js': DEFAULT_INDEX_JS,
        'manifest_json': True,
        'web_stuff': True,
        'related_applications': [RELATED_APP_PLAY, RELATED_APP_PLAY_REAL],
    },

    'web_broken': {
        'explanation': 'Site which is a broken web app.',
        'short_explanation': 'Web app, broken',
        'index_js': DEFAULT_INDEX_JS,
        'manifest_json': True,
        'viewport': 'minimum-scale=0.6, maximum-scale=5.0, '
                    'user-scalable=fixed, INITIAL-SCALE=1.0, '
                    'width=device-width',
        'web_stuff': True,
        'icons': make_icons(name='missing', broken_sizes=True),
        'display': None,
    },

    'web_no_meta_viewport': {
        'explanation': 'Site which is missing a viewport.',
        'short_explanation': 'Web app, with no meta-viewport',
        'index_js': DEFAULT_INDEX_JS,
        'manifest_json': True,
        'viewport': None,
        'web_stuff': True,
    },

    'web_redispatch': {
        'explanation': 'Site which is a valid web app.',
        'short_explanation': 'Web app, testing beforeinstallprompt',
        'index_js': 'index_redispatch.js',
        'manifest_json': True,
        'web_stuff': True,
    },

    'web_svg': {
        'explanation': 'Site which is a valid web app and has an SVG icon.',
        'short_explanation': 'Web app with SVG icon',
        'index_js': DEFAULT_INDEX_JS,
        'manifest_json': True,
        'web_stuff': True,
        'icons': [collections.OrderedDict([
                  ('src', 'marmot.svg'),
                  ('sizes', 'any'),
                  ('type', 'image/svg+xml'),
                 ])],
    },

}
