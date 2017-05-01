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

import mimetypes

import jinja2
import webapp2


template_loader = jinja2.FileSystemLoader('templates')
env = jinja2.Environment(loader=template_loader, autoescape=True)


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
        template = env.get_template(filename)
        self.response.write(template.render())


app = webapp2.WSGIApplication([
    (r'/([^/]*)$', IndexRedirect),
    (r'/([^/]*)/([^/]*)', TemplatedPage),
], debug=True)
