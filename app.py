from flask import Flask, render_template, request, jsonify, make_response
import json
import pickle
import socket
import os

if not os.path.exists('leaderboard.obj'):
    scores = []
    with open(b"leaderboard.obj","wb") as f:
        pickle.dump(scores,file=f)

app = Flask(__name__)

@app.route("/",methods=['POST','GET'])
def loadHTML():
    with open(b"leaderboard.obj","rb") as f:
        try:
            scores = pickle.load(f)
        except EOFError as e:
            scores = []
        print(scores)
    return render_template('index.html')


@app.route("/atl", methods=["POST","GET"])
def atl():
    u_p = json.loads(request.data)
    if u_p.get('usr_name') is not None:
        with open(b"leaderboard.obj","rb") as f:
            scores = pickle.load(f)
        scores.append([u_p['usr_name'],u_p['np'] ])
        scores.sort(key=lambda a: a[1])
        with open(b"leaderboard.obj","wb") as f:              
            pickle.dump(scores,f)
    return jsonify(data=scores)

@app.route("/frl")
def frl():
    with open(b"leaderboard.obj","rb") as f:
            scores = pickle.load(f)
    print(scores)
    return jsonify(scores)

if __name__ == "__main__":
    app.run(debug=True)