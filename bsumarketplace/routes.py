from flask import render_template
from bsumarketplace import app
from bsumarketplace.forms import RegistrationForm, LoginForm

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html') ### Insert Title If needed


@app.route('/login')
def login():
    form = RegistrationForm()
    return render_template('login.html', title = 'Login', form=form)

@app.route('/signup')
def signup():
    form = RegistrationForm()
    return render_template('signup.html', title = 'Register', form=form)