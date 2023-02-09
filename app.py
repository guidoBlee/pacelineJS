from flask import Flask, render_template
import socket
hostname = socket.getfqdn()
def create_app():
    app = Flask(__name__)

    @app.route("/")
    def loadHTML():
        return render_template('index.html')
