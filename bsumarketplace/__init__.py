from flask import Flask
from flask_sqlalchemy import SQLAlchemy   
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_migrate import Migrate



app = Flask(__name__)

app.config['SECRET_KEY'] = '4acfddcdf3e1362c239375a48b0ea52e'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

db = SQLAlchemy(app)
migrate = Migrate(app, db)

bcrypt = Bcrypt(app)

login_manager = LoginManager(app)


from bsumarketplace import routes, models
