from flask import Flask, render_template
app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html') ### Insert Title If needed


@app.route('/page2')
def hello2():
    return 'Ho'


@app.route('/link3')
def hello3():
    return 'Ho'


if __name__ == '__main__':
    app.run(debug=True)