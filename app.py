from flask import Flask, render_template, flash, url_for

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/<folder>/<something>')
def project(folder,something):
    try:
        return render_template('/' + folder + '/' + something + '.html')
    except:
        flash(u'project not found :( ', 'error')
        return hello_world()


if __name__ == '__main__':
    app.debug = True
    app.secret_key = 'super_secret'
    app.run()
