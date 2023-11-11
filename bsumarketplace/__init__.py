from flask import Flask

app = Flask(__name__)

app.config['SECRET_KEY'] = '4acfddcdf3e1362c239375a48b0ea52e' ### secret key using secrets.tokenhex (16)


from bsumarketplace import routes
