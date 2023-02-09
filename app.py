from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def loadHTML():
    return render_template('index.html')


app.run(host='192.168.0.64')