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

import collections
import json
import mimetypes

import jinja2
import webapp2

import app_data


template_loader = jinja2.FileSystemLoader('templates')
env = jinja2.Environment(loader=template_loader, autoescape=True)


def get_index_template_params(appname):
    """Get the template parameters for index.html."""
    try:
      return app_data.APPS[appname]
    except KeyError:
      webapp2.abort(404, explanation='No such app: %s' % appname)


def build_manifest(appname):
    """Creates a manifest for the app."""
    try:
      data = app_data.APPS[appname]
    except KeyError:
      webapp2.abort(404, explanation='No such app: %s' % appname)

    # Create the manifest dictionary, tailoring it based on |data|.
    # Insert the items in the order they are documented in the Manifest spec.
    manifest = collections.OrderedDict()
    if 'web_stuff' in data and data['web_stuff']:
      manifest['name'] = app_data.DEFAULT_NAME
      manifest['short_name'] = app_data.DEFAULT_SHORT_NAME
      manifest['icons'] = app_data.DEFAULT_ICONS
      manifest['display'] = app_data.DEFAULT_DISPLAY
      manifest['start_url'] = app_data.DEFAULT_START_URL
    if 'icons' in data:
      if data['icons']:
        manifest['icons'] = app_data.DEFAULT_ICONS
      elif 'icons' in manifest:
        del manifest['icons']
    if 'display' in data:
      if data['display'] is not None:
        manifest['display'] = data['display']
      elif 'display' in manifest:
        del manifest['display']

    return json.dumps(manifest, indent=2, separators=(',', ': ')) + '\n'


class IndexRedirect(webapp2.RequestHandler):
    """
    Redirect by adding a '/' to the end of the URL (so that relative links are
    correct).
    """
    def get(self, appname):
        self.response.status = 301
        self.response.location = self.request.uri + '/'


class TemplatedPage(webapp2.RequestHandler):
    """
    Serves URLs of the form "/$APPNAME/$FILENAME". The file is served from the
    templates directory, modified specially for each individual app.
    """
    def get(self, appname, filename):
        if not filename:
            filename = 'index.html'

        mime_type, encoding = mimetypes.guess_type(filename)

        self.response.content_type = mime_type
        if encoding is not None:
            self.response.content_type_params = {'charset', encoding}

        if filename == 'manifest.json':
            response_body = build_manifest(appname)
        else:
            template = env.get_template(filename)

            template_params = {}
            if filename == 'index.html':
              template_params = get_index_template_params(appname)

            response_body = template.render(template_params)
        self.response.write(response_body)


app = webapp2.WSGIApplication([
    (r'/([^/]*)$', IndexRedirect),
    (r'/([^/]*)/([^/]*)', TemplatedPage),
], debug=True)
