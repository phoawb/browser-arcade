from flask import Flask, render_template, request, redirect, url_for
import os
import json


def load_scores():
    if not os.path.exists("scores.json"):
        with open("scores.json", "w") as f:
            json.dump({}, f)

    with open("scores.json") as f:
        return json.load(f)


def save_scores(scores):
    with open("scores.json", "w") as f:
        json.dump(scores, f, indent=2)


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/game/<game_name>")
def play_game(game_name):
    return render_template("game.html", game=game_name)


@app.route("/game/<game_name>/gameover", methods=["POST"])
def gameover(game_name):
    score = request.form.get("score")
    if not score:
        raise Exception
    score = int(score)

    # Load existing scores from the JSON file
    scores = load_scores()

    # Get the list of scores for the specific game
    game_scores = scores.get(game_name, [])

    # Add the new score to the list
    game_scores.append({"score": score})

    # Sort the scores in descending order
    game_scores.sort(key=lambda x: x["score"], reverse=True)

    # Keep only the top 10 scores
    game_scores = game_scores[:10]

    # Update the scores for the specific game
    scores[game_name] = game_scores

    # Save the updated scores to the JSON file
    save_scores(scores)

    return redirect(url_for("high_scores", game=game_name))


@app.route("/high_scores/<game>")
def high_scores(game):
    # Load scores from the JSON file
    scores = load_scores()

    # Get the list of scores for the specific game
    game_scores = scores.get(game, [])

    return render_template("high_scores.html", game=game, scores=game_scores)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
