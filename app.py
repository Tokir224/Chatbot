from flask import Flask, render_template, request
from train import send_message

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/get")
def get_bot_response():
    received_message = request.args.get('msg')
    try:
        response = send_message(received_message)
    except:
        response = "Sorry, I didn't Get You"
    return str(response)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000,debug=True)
