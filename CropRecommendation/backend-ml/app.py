from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

model = pickle.load(open("model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    input_data = pd.DataFrame([[
        data["N"],
        data["P"],
        data["K"],
        data["temperature"],
        data["humidity"],
        data["ph"],
        data["rainfall"]
    ]], columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall"])

    prediction = model.predict(input_data)[0]

    return jsonify({
        "recommended_crop": prediction
    })

if __name__ == "__main__":
    app.run(debug=True)
