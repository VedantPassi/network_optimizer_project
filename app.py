from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load your model
model = joblib.load('trained_catboost_model.joblib')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get form data for sliders
    signal_strength = float(request.form.get('Signal_Strength', 0))
    latency = float(request.form.get('Latency', 0))
    bandwidth_utilization = float(request.form.get('Bandwidth_Utilization_Ratio', 0))

    # Check if each checkbox is present in the form data, set to 1 if "on" (checked), otherwise 0
    application_types = [
        1 if request.form.get('Application_Type_Background_Download') == "on" else 0,
        1 if request.form.get('Application_Type_Emergency_Service') == "on" else 0,
        1 if request.form.get('Application_Type_File_Download') == "on" else 0,
        1 if request.form.get('Application_Type_IoT_Temperature') == "on" else 0,
        1 if request.form.get('Application_Type_Online_Gaming') == "on" else 0,
        1 if request.form.get('Application_Type_Streaming') == "on" else 0,
        1 if request.form.get('Application_Type_Video_Call') == "on" else 0,
        1 if request.form.get('Application_Type_Video_Streaming') == "on" else 0,
        1 if request.form.get('Application_Type_VoIP_Call') == "on" else 0,
        1 if request.form.get('Application_Type_Voice_Call') == "on" else 0,
        1 if request.form.get('Application_Type_Web_Browsing') == "on" else 0
    ]
    
    # Prepare input data for the model
    input_data = np.array([[signal_strength, latency, bandwidth_utilization] + application_types])

    # Make a prediction
    try:
        prediction = model.predict(input_data)[0]
        prediction_scaled = round(prediction * 100, 2)
        return jsonify({'prediction': prediction_scaled})
    except Exception as e:
        print("Error:", e)  # Log the error for debugging
        return jsonify({'error': 'There was an error processing your request.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
