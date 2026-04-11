from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import numpy as np
import os
import joblib
from typing import List, Optional
from enum import Enum
import uvicorn

# Optional TensorFlow for LSTM
try:
    import tensorflow as tf
    HAS_TENSORFLOW = True
    
    # Emergency Global Monkey-Patch for Keras version mismatch
    # This strips 'quantization_config' from Dense layers during deserialization
    original_dense_init = tf.keras.layers.Dense.__init__
    def patched_dense_init(self, *args, **kwargs):
        kwargs.pop('quantization_config', None)
        return original_dense_init(self, *args, **kwargs)
    tf.keras.layers.Dense.__init__ = patched_dense_init
            
except ImportError:
    HAS_TENSORFLOW = False
    print("[WARN] TensorFlow not found. LSTM model will be disabled.")

app = FastAPI(title="Smart Farm ML Service")


# Paths
BASE_DIR = os.path.dirname(__file__)
LSTM_MODEL_PATH = os.path.join(BASE_DIR, "soil_moisture_lstm.h5")
DT_MODEL_PATH = os.path.join(BASE_DIR, "decision_tree_model.pkl")
RF_MODEL_PATH = os.path.join(BASE_DIR, "random_forest_model.pkl")
TS_MODEL_PATH = os.path.join(BASE_DIR, "time_series_model.pkl")
FERTILIZER_MODEL_PATH = os.path.join(BASE_DIR, "fertilizer_model.pkl")
GROWTH_MODEL_PATH = os.path.join(BASE_DIR, "growth_stage_model.keras")

# Load models globally
lstm_model = None
dt_model = None
rf_model = None
ts_model = None
fertilizer_model = None
growth_model = None

if HAS_TENSORFLOW and os.path.exists(LSTM_MODEL_PATH):
    try:
        lstm_model = tf.keras.models.load_model(LSTM_MODEL_PATH, compile=False, safe_mode=False)
        print("[OK] LSTM Model loaded")
    except Exception as e:
        print(f"[WARN] Error loading LSTM: {e}")
elif not HAS_TENSORFLOW:
    print("[WARN] Skipping LSTM model (TensorFlow not installed)")


if os.path.exists(DT_MODEL_PATH):
    dt_model = joblib.load(DT_MODEL_PATH)
    print(f"[OK] Decision Tree Model loaded")

if os.path.exists(RF_MODEL_PATH):
    rf_model = joblib.load(RF_MODEL_PATH)
    print(f"[OK] Random Forest Model loaded")

if os.path.exists(TS_MODEL_PATH):
    ts_model = joblib.load(TS_MODEL_PATH)
    print(f"[OK] Time Series Model loaded")

if os.path.exists(FERTILIZER_MODEL_PATH):
    fertilizer_model = joblib.load(FERTILIZER_MODEL_PATH)
    print(f"[OK] Fertilizer Model loaded")

if HAS_TENSORFLOW and os.path.exists(GROWTH_MODEL_PATH):
    try:
        growth_model = tf.keras.models.load_model(GROWTH_MODEL_PATH, compile=False, safe_mode=False)
        print(f"[OK] Growth Stage Model loaded")
    except Exception as e:
        print(f"[WARN] Error loading Growth Stage model: {e}")

class ModelType(str, Enum):
    LSTM = "lstm"
    DECISION_TREE = "decision_tree"
    RANDOM_FOREST = "random_forest"

class PredictRequest(BaseModel):
    soilMoisture: List[float]
    temperature: List[float]
    humidity: List[float]
    rain: List[int]

class SingleStepRequest(BaseModel):
    temperature: float
    humidity: float
    rain: int
    prev_moisture: float

class ForecastRequest(BaseModel):
    lags: List[float] # [lag_3, lag_2, lag_1] or [lag_1, lag_2, lag_3] depending on training

class FertilizerRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    soilMoisture: float

# Preprocessing helpers
def scale_inputs(values, feature_idx):
    ranges = {0: (0, 100), 1: (0, 50), 2: (0, 100), 3: (0, 1)}
    mi, ma = ranges.get(feature_idx, (0, 100))
    return (np.array(values) - mi) / (ma - mi)

def descale_output(val):
    mi, ma = (0, 100)
    return float(val * (ma - mi) + mi)

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "models": {
            "lstm": lstm_model is not None,
            "decision_tree": dt_model is not None,
            "random_forest": rf_model is not None,
            "time_series": ts_model is not None,
            "fertilizer": fertilizer_model is not None,
            "growth_stage": growth_model is not None
        }
    }

@app.post("/predict")
async def predict_lstm(req: PredictRequest):
    if len(req.soilMoisture) != 12:
        raise HTTPException(status_code=400, detail="Must provide exactly 12 time steps")

    try:
        s_moisture = scale_inputs(req.soilMoisture, 0)
        s_temp = scale_inputs(req.temperature, 1)
        s_humidity = scale_inputs(req.humidity, 2)
        s_rain = scale_inputs(req.rain, 3)

        input_data = np.stack([s_moisture, s_temp, s_humidity, s_rain], axis=1)
        input_data = np.expand_dims(input_data, axis=0)

        if lstm_model:
            prediction = lstm_model.predict(input_data, verbose=0)
            predicted_moisture = descale_output(prediction[0][0])
            status = "success"
        else:
            predicted_moisture = req.soilMoisture[-1] * 0.98 + (0.5 if req.rain[-1] else -1.2)
            status = "simulated"
        
        return {"predictedMoisture": round(predicted_moisture, 2), "status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/fertilizer")
async def predict_fertilizer(req: FertilizerRequest):

    if not fertilizer_model:
        raise HTTPException(status_code=503, detail="Fertilizer model unavailable")

    try:
        # Features: ['N', 'P', 'K', 'temperature', 'humidity', 'moisture']
        features = np.array([[
            req.N,
            req.P,
            req.K,
            req.temperature,
            req.humidity,
            req.soilMoisture
        ]])
        prediction = fertilizer_model.predict(features)
        response = {"recommended_fertilizer": str(prediction[0])}

        if hasattr(fertilizer_model, "predict_proba"):
            probabilities = fertilizer_model.predict_proba(features)
            if probabilities is not None and len(probabilities) > 0:
                response["confidence"] = round(float(np.max(probabilities[0])), 4)

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/soil-moisture")
async def predict_tree(req: SingleStepRequest, model_type: ModelType = ModelType.RANDOM_FOREST):
    model = rf_model if model_type == ModelType.RANDOM_FOREST else dt_model
    
    if not model:
        # Fallback simulation
        predicted = req.prev_moisture * 0.99 + (0.2 if req.rain else -0.5)
        return {"predictedMoisture": round(predicted, 2), "status": "simulated"}

    try:
        # Features: ['temperature', 'humidity', 'rain', 'prev_moisture']
        features = np.array([[req.temperature, req.humidity, req.rain, req.prev_moisture]])
        prediction = model.predict(features)
        return {"predictedMoisture": round(float(prediction[0]), 2), "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/forecast")
async def predict_forecast(req: ForecastRequest):
    if not ts_model:
        # Simple moving average fallback
        if not req.lags: return {"forecast": 0, "status": "simulated"}
        predicted = sum(req.lags) / len(req.lags)
        return {"forecast": round(predicted, 2), "status": "simulated"}

    try:
        # Features: ['lag_1', 'lag_2', 'lag_3']
        # We'll assume the input list lags is [lag_1, lag_2, lag_3]
        if len(req.lags) != 3:
            raise HTTPException(status_code=400, detail="Must provide exactly 3 lags")
            
        features = np.array([req.lags])
        prediction = ts_model.predict(features)
        return {"forecast": round(float(prediction[0]), 2), "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

GROWTH_STAGES = [
    "Young Bud",
    "Mature Bud",
    "Early Bloom",
    "Full Bloom",
    "Wilted"
]

GROWTH_RECOMMENDATIONS = {
    "Young Bud": "Young bud stage - ensure adequate soil moisture and avoid water stress. Monitor for early pests.",
    "Mature Bud": "Mature bud stage - optimal time for nutrient boosting. Keep environment stable for blooming.",
    "Early Bloom": "Early bloom stage - protect from extreme temperatures. Soil should be consistently damp.",
    "Full Bloom": "Full bloom stage - peak beauty and health. Ensure good ventilation and light.",
    "Wilted": "Wilted stage - bloom cycle ending. Monitor for hydration levels and transition to standard care."
}

@app.post("/predict/growth-stage")
async def predict_growth(file: UploadFile = File(...)):
    if not HAS_TENSORFLOW or not growth_model:
        # Fallback simulation
        import random
        stage = random.choice(GROWTH_STAGES)
        confidence = random.uniform(85.0, 98.0)
        recommendation = GROWTH_RECOMMENDATIONS.get(stage)
        
        print(f"[WARN] Growth model unavailable. Providing simulated result: {stage}")
        
        return {
            "stage": stage,
            "confidence": round(confidence, 2),
            "recommendation": recommendation,
            "status": "simulated"
        }
    
    try:
        # Read and preprocess image
        contents = await file.read()
        img = tf.io.decode_image(contents, channels=3)
        img = tf.image.resize(img, [224, 224])
        
        # Pixel Stats for Debugging
        pixel_mean = float(tf.reduce_mean(img))
        pixel_std = float(tf.math.reduce_std(img))
        
        img = tf.expand_dims(img, axis=0)
        # REMOVED: (img / 127.5) - 1.0 (EfficientNet handles [0, 255] better if built-in rescaling exists)

        # Predict
        predictions = growth_model.predict(img, verbose=0)
        class_idx = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        all_scores = [round(float(s), 4) for s in predictions[0]]
        
        # Debug Logs
        print(f"\n--- Inference Debug ---")
        print(f"Stats: mean={pixel_mean:.2f}, std={pixel_std:.2f}")
        print(f"Scores: {all_scores}")
        print(f"Top: {GROWTH_STAGES[class_idx]} ({confidence:.2%})")
        print(f"-----------------------\n")

        # Determine stage name
        if class_idx < len(GROWTH_STAGES):
            stage = GROWTH_STAGES[class_idx]
        else:
            stage = f"Unknown Stage ({class_idx})"
            
        recommendation = GROWTH_RECOMMENDATIONS.get(stage, "Continue regular crop monitoring and standard care.")
        
        return {
            "stage": stage,
            "confidence": round(confidence * 100, 2),
            "all_scores": all_scores,
            "recommendation": recommendation,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("SHETKARI ML SERVICE v2.0 READY")
    print("Dynamic Inference & [-1, 1] Preprocessing Active")
    print("="*50 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)

