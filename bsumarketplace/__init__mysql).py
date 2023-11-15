from flask import Flask
from flask_mysqldb import MySQL


app = Flask(__name__)

app.config['SECRET_KEY'] = '4acfddcdf3e1362c239375a48b0ea52e' ### secret key using secrets.tokenhex (16)

app.config['MYSQL_USER'] ='sql12661009'
app.config['MYSQL_PASSWORD'] ='5Q4XRlEDrA'
app.config['MYSQL_HOST'] = 'sql12.freemysqlhosting.net'
app.config['MYSQL_DB'] = 'sql12661009'
app.config['MYSQL_CURSORCLASS'] ='DictCursor'

mysql = MySQL()
mysql.init_app (app)



from bsumarketplace import routes
