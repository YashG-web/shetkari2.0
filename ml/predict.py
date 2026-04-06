import sys
import json
import numpy as np
import os

# Suppress TensorFlow logging to keep output clean
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

try:
    import tensorflow as tf
except ImportError:
    print("Error: TensorFlow not installed. Run 'pip install tensorflow'")
    sys.exit(1)

def predict():
    if len(sys.argv) < 2:
        print("Error: No input data provided")
        sys.exit(1)

    try:
        # Load input JSON from command line
        input_json = sys.argv[1]
        input_dict = json.loads(input_json)
        
        # Expecting shape (1, 12, 4): 1 sample, 12 time steps, 4 features
        # Features: [soilMoisture, temperature, humidity, rain]
        data = np.array(input_dict['data'], dtype=np.float32)

        if data.shape != (1, 12, 4):
            print(f"Error: Invalid input shape {data.shape}, expected (1, 12, 4)")
            sys.exit(1)

        # Load model
        model_path = os.path.join(os.path.dirname(__file__), "soil_moisture_lstm.h5")
        if not os.path.exists(model_path):
            print(f"Error: Model not found at {model_path}")
            sys.exit(1)

        model = tf.keras.models.load_model(model_path, compile=False)
        
        # Run prediction
        prediction = model.predict(data, verbose=0)
        
        # Assuming output is the next moisture value (0-100 range)
        # Shift back from normalized if necessary, but here we output raw moisture prediction
        result = float(prediction[0][0])
        
        # Final clean output for Node.js
        print(f"{result:.1f}")

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    predict()
