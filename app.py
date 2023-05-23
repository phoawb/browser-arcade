from flask import Flask, render_template, request, redirect, url_for
import json

def load_scores():
    with open('scores.json') as f:
        return json.load(f)

def save_scores(scores):
    with open('scores.json', 'w') as f:
        json.dump(scores, f, indent=2)


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/game/<game_name>')
def play_game(game_name):
    return render_template('game.html', game=game_name)

@app.route('/game/<game_name>/gameover', methods=['POST'])
def gameover(game_name):
    score = request.form.get('score')
    if not score: 
        raise Exception
    score = int(score)
    # Save the score for the game here
    return redirect(url_for('high_scores', game=game_name))

@app.route('/high_scores/<game>')
def high_scores(game):
    # Retrieve and render high scores for the specified game
    return render_template('high_scores.html', game=game)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
