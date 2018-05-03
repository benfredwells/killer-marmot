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
import custom


template_loader = jinja2.FileSystemLoader('templates')
env = jinja2.Environment(loader=template_loader, autoescape=True)

# MIME types (the App Engine server doesn't seem to have the defaults loaded).
mimetypes.add_type('text/html', '.html')
mimetypes.add_type('application/json', '.json')


def get_app_page_template_params(appname):
    """Get the template parameters for the app page."""
    try:
      params = app_data.APPS[appname].copy()
    except KeyError:
      webapp2.abort(404, explanation='No such app: %s' % appname)

    if 'web_stuff' in params and params['web_stuff']:
      if 'viewport' not in params:
        params['viewport'] = app_data.DEFAULT_VIEWPORT

    return params


def get_app_list():
    """Gets a list of apps and their descriptions."""
    for name, data in sorted(app_data.APPS.iteritems()):
      yield {'name': name, 'description': data.get('short_description', name)}


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
    FIELDS = ('icons', 'display', 'related_applications',
              'prefer_related_applications')
    for field in FIELDS:
      if field in data:
        if data[field] is not None:
          manifest[field] = data[field]
        elif field in manifest:
          del manifest[field]

    return json.dumps(manifest, indent=2, separators=(',', ': ')) + '\n'


class IndexPage(webapp2.RequestHandler):
    """
    Serves URLs of the form "/$APPNAME/$FILENAME". The file is served from the
    templates directory, modified specially for each individual app.
    """
    def get(self):
        self.response.content_type = 'text/html'
        self.response.content_type_params = {'charset': 'utf-8'}
        template = env.get_template('index.html')
        app_list = list(get_app_list())
        response_body = template.render({'apps': app_list})
        self.response.write(response_body)


class IndexRedirect(webapp2.RequestHandler):
    """
    Redirect by adding a '/' to the end of the URL (so that relative links are
    correct).
    """
    def get(self):
        self.response.status = 301
        self.response.location = self.request.uri + '/'


class TemplatedPage(webapp2.RequestHandler):
    """
    Serves URLs of the form "/$APPNAME/$FILENAME". The file is served from the
    templates directory, modified specially for each individual app.
    """
    def get(self, appname, filename):
        if not filename:
            filename = 'app.html'

        mime_type, _ = mimetypes.guess_type(filename)

        self.response.content_type = mime_type
        self.response.content_type_params = {'charset': 'utf-8'}

        if filename == 'manifest.json':
            response_body = build_manifest(appname)
        else:
            template = env.get_template(filename)

            template_params = {}
            if filename == 'app.html':
              template_params = get_app_page_template_params(appname)

            response_body = template.render(template_params)
        self.response.write(response_body)


class CustomApp(webapp2.RequestHandler):
    """
    Serves URLs of the form "/custom/$B64MANIFEST/$FILENAME". The
    $B64MANIFEST is the app's manifest file, with whitespace removed,
    URL-safe-base-64-encoded. This allows the user to construct and
    bookmark any manifest they like.
    """
    def get(self, b64manifest, filename):
        if not filename:
            filename = 'app.html'

        mime_type, _ = mimetypes.guess_type(filename)

        self.response.content_type = mime_type
        self.response.content_type_params = {'charset': 'utf-8'}

        if filename == 'manifest.json':
            status, response_body = custom.build_custom_manifest(b64manifest)
            self.response.status = status
        else:
            template = env.get_template(filename)

            template_params = {}
            if filename == 'app.html':
              template_params = custom.get_template_params()

            response_body = template.render(template_params)
        self.response.write(response_body)


app = webapp2.WSGIApplication([
    (r'/$', IndexPage),
    (r'/[^/]*$', IndexRedirect),
    (r'/custom/([A-Za-z0-9\-_=]*)/([^/]*)', CustomApp),
    (r'/([^/]*)/([^/]*)', TemplatedPage),
], debug=True)
