# Rawscripts - Screenwriting Software
# Copyright (C) Ritchie Wilson
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import json
import os
from urllib.parse import urlparse

from flask import Flask, render_template, send_from_directory, request, redirect, url_for, Response
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_user import UserManager, SQLAlchemyAdapter, current_user
from flask_user.signals import user_registered
from flask_assets import Environment, Bundle

app = Flask(__name__, template_folder='html')
app.config.from_object(os.environ.get('APP_SETTINGS', 'config.DevelopmentConfig'))

db = SQLAlchemy(app)
mail = Mail(app)

# Ensure the models and utilities are imported correctly
from models import User  # Assuming your user model is in a file called models.py
db_adapter = SQLAlchemyAdapter(db, User)
user_manager = UserManager(db_adapter, app)

# Adjust paths and file handling as necessary
assets = Environment(app)
editor_js = Bundle('js/restricted/editor/screenplay.coffee',
                   'js/restricted/editor/spellcheck.coffee',
                   filters='coffeescript', output='js/editor-coffee.js')
assets.register('editor', editor_js)

scriptlist_js = Bundle('js/restricted/scriptlist/scriptlist.coffee',
                       filters='coffeescript', output='js/scriptlist-coffee.js')
assets.register('scriptlist', scriptlist_js)

# Additional Flask components
from extra_modules import flask_editor, flask_scriptlist, flask_screenplay_export, flask_blog

@app.context_processor
def inject_config():
    return {'MODE': 'PRO', 'ANALYTICS_ID': app.config['ANALYTICS_ID']}

@user_registered.connect_via(app)
def _after_registration_hook(sender, user, **extra):
    user.link_shared_screenplays()

@app.route('/')
def welcome():
    if current_user.is_authenticated:
        if not request.referrer:
            return redirect(url_for('scriptlist'))
        url = urlparse(request.referrer)
        paths = ['/blog', '/contact', '/about', '/scriptlist']
        if url.netloc == app.config['SERVER_NAME'] and url.path not in paths:
            return redirect(url_for('scriptlist'))
    form = user_manager.login_form(next=url_for('scriptlist'))
    return render_template('flask_welcome.html', form=form, login_form=form)

@app.route('/contact')
def contact():
    return render_template('flask_contact.html')

@app.route('/synccontacts', methods=['POST'])
def synccontacts():
    return Response('[]', mimetype='text/plain')

@app.route('/uploadhelp')
def uploadhelp():
    return render_template('uploadhelp.html')

@app.route('/css/<css_file>')
def css_redirect(css_file):
    return send_from_directory('static/css', css_file)

@app.route('/css/min/<css_file>')
def css_min_redirect(css_file):
    return send_from_directory('static/css/min', css_file)

@app.route('/images/<img_file>')
def images_redirect(img_file):
    return send_from_directory('static/images', img_file)

@app.route('/images/blog/<img_file>')
def blog_images_redirect(img_file):
    return send_from_directory('static/images/blog', img_file)

@app.route('/js/min/<js_file>')
def js_redirect(js_file):
    return send_from_directory('static/js/min', js_file)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/images'), 'favicon.ico')
