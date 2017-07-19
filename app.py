from flask import Flask, render_template, flash

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/<folder>/<page>')
def project(folder,page):
    try:
        return render_template('/' + folder + '/' + page + '.html')
    except:
        flash(u'project not found :( ', 'error')
        return index()


if __name__ == '__main__':
    app.debug = True
    app.secret_key = 'super_secret'
    app.run()
