from flask import Flask, render_template
import socket
hostname = socket.getfqdn()

app = Flask(__name__)

@app.route("/")
def loadHTML():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host='192.168.0.64')