import { Router, type IRouter } from "express";
import { sensorHistory } from "../lib/shared-state";
import axios from "axios";

const router: IRouter = Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

router.get("/predict-moisture", async (_req, res) => {
  // 1. Ensure we have enough data (12 points)
  if (sensorHistory.length < 12) {
    res.json({ 
      status: "waiting", 
      message: `Collecting data points... (${sensorHistory.length}/12)`,
      predictedMoisture: null 
    });
    return;
  }

  // 2. Prepare data for ML Service
  const payload = {
    soilMoisture: sensorHistory.map(h => h.soilMoisture),
    temperature: sensorHistory.map(h => h.temperature),
    humidity: sensorHistory.map(h => h.humidity),
    rain: sensorHistory.map(h => h.rain ? 1 : 0)
  };

  try {
    // 3. Call ML Service via Axios
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, payload);
    
    res.json({
      status: "success",
      predictedMoisture: response.data.predictedMoisture,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("ML Service Error:", error.message);
    res.status(500).json({ 
      error: "ML Inference Failed", 
      details: error.message 
    });
  }
});


export default router;
