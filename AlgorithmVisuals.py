from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/search/mazegenerator')
def maze_gen():
    return render_template('search/maze_gen.html')

@app.route('/search/maze_astar')
def maze_astar():
    return render_template('search/maze_astar.html')

@app.route('/search/dfs3d')
def maze_3d():
    return render_template('search/dfs3d.html')







if __name__ == '__main__':
    app.debug = True
    app.run()
