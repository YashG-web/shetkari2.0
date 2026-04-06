import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// Shared simulation state for all routes
export let simulatorConfig = {
  models: {
    lstm: true,
    randomForest: true,
    regression: true,
    ruleEngine: true,
  },
  controls: {
    temperature: 25,
    humidity: 60,
    rain: false,
    soilMoisture: 50,
    nitrogen: 150,
    phosphorus: 50,
    potassium: 200,
    pH: 6.5,
  },
};

export let currentSimulatedData: any = {
  timestamp: new Date().toISOString(),
  soilMoisture: 50,
  temperature: 25,
  humidity: 60,
  rain: false,
  nitrogen: 150,
  phosphorus: 50,
  potassium: 200,
  pH: 6.5,
  lstmOutput: 52,
  rfOutput: "OFF",
  regressionOutput: 0,
  ruleEngineOutput: "System Idle",
  
  // New ML specific fields
  rfPrediction: 50,
  dtInsights: ["Establishing initial baseline...", "Waiting for sensor stream..."],
  tsForecastData: [] as { time: string, value: number }[]
};

export let sensorHistory: any[] = [];

export function updateConfig(newConfig: typeof simulatorConfig) {
  simulatorConfig = newConfig;
}

export function updateSimulatedData(newData: any) {
  currentSimulatedData = newData;
}

// Helper to generate explainability insights from Decision Tree context
function generateDTInsights(moisture: number, temp: number, humidity: number, rain: boolean): string[] {
  const insights: string[] = [];
  if (rain) insights.push("🌧️ Recent rainfall boosted soil moisture levels.");
  if (temp > 35) insights.push("🔥 High ambient temperature is accelerating evaporation.");
  if (humidity > 80) insights.push("💧 High humidity is reducing transpiration stress.");
  if (moisture < 30) insights.push("⚠️ Critical: Low moisture detected by sensors.");
  if (insights.length === 0) insights.push("🍀 Environmental conditions are currently stable.");
  return insights;
}

// Logic to calculate the next simulation step (Physical only + Default ML fields)
export function calculateStep(config: typeof simulatorConfig, current: any) {
  const { temperature, humidity, rain, nitrogen, phosphorus, potassium, pH } = config.controls;
  
  let newMoisture = current.soilMoisture || 50;
  
  // Realistic physics for moisture change
  if (rain) {
    newMoisture += 0.8 + Math.random() * 1.2;
  } else {
    let lossRate = 0.15;
    if (temperature > 30) lossRate *= 1.8;
    if (humidity < 40) lossRate *= 1.4;
    if (humidity > 80) lossRate *= 0.6;
    newMoisture -= lossRate * (1 + Math.random() * 0.5);
  }
  
  newMoisture = Math.max(0, Math.min(100, newMoisture));

  const jitter = (v: number, r: number) => Number((v + (Math.random() - 0.5) * r).toFixed(1));

  return {
    timestamp: new Date().toISOString(),
    soilMoisture: Number(newMoisture.toFixed(1)),
    temperature: jitter(temperature, 1),
    humidity: jitter(humidity, 2),
    rain,
    nitrogen: jitter(nitrogen, 4),
    phosphorus: jitter(phosphorus, 2),
    potassium: jitter(potassium, 4),
    pH: Number((pH + (Math.random() - 0.5) * 0.1).toFixed(2)),
    
    // Default ML fields for sync compatibility
    lstmOutput: 0,
    rfOutput: "OFF",
    regressionOutput: 0,
    ruleEngineOutput: "Simulating...",
    rfPrediction: Number(newMoisture.toFixed(1)),
    dtInsights: ["Sync simulation step"],
    tsForecastData: []
  };
}


// Async loop to fetch real ML predictions
async function runMLInference() {
  const data = calculateStep(simulatorConfig, currentSimulatedData);
  const mlData: any = { ...data };

  try {
    // 1. Random Forest Prediction (The "Accuracy" model)
    const rfResponse = await axios.post(`${ML_SERVICE_URL}/predict/soil-moisture?model_type=random_forest`, {
      temperature: data.temperature,
      humidity: data.humidity,
      rain: data.rain ? 1 : 0,
      prev_moisture: data.soilMoisture
    });
    mlData.rfPrediction = rfResponse.data.predictedMoisture;
    mlData.rfOutput = mlData.rfPrediction < 35 ? "ON" : "OFF"; // Shared logic for pump

    // 2. Decision Tree Explainability (Insights)
    mlData.dtInsights = generateDTInsights(data.soilMoisture, data.temperature, data.humidity, data.rain);
    
    // 3. Time Series Forecasting (Next 7 steps)
    // For the UI trend graph, we'll generate a 7-step forecast
    const forecast: { time: string, value: number }[] = [];
    let lastMoisture = data.soilMoisture;
    
    // We fetch one prediction from the model and then simulate a trend
    const tsResponse = await axios.post(`${ML_SERVICE_URL}/predict/forecast`, {
      lags: [data.soilMoisture, data.soilMoisture * 0.99, data.soilMoisture * 0.98] // Mocking lags for now
    });
    
    const nextVal = tsResponse.data.forecast;
    for (let i = 1; i <= 7; i++) {
      const timeLabel = new Date(Date.now() + i * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      forecast.push({ 
        time: timeLabel, 
        value: Number((nextVal + (i * (data.rain ? 2 : -1.5))).toFixed(1)) // Projected trend
      });
    }
    mlData.tsForecastData = forecast;
    mlData.regressionOutput = nextVal;

    // 4. Rule Engine (Actionable logic)
    if (data.rain) {
      mlData.ruleEngineOutput = "Rain detected: Irrigation skipped";
    } else if (data.soilMoisture < 30) {
      mlData.ruleEngineOutput = "Critical: Auto-irrigation started";
    } else {
      mlData.ruleEngineOutput = "Optimal: No action required";
    }

  } catch (error: any) {
    console.error("ML Inference error in simulation loop:", error.message);
    // Fallback to basic logic if ML service is down
    mlData.rfPrediction = data.soilMoisture;
    mlData.dtInsights = ["AI Service temporarily offline. Using rule-based fallback."];
    mlData.tsForecastData = [];
  }

  currentSimulatedData = mlData;

  // Update history buffer for LSTM (keep last 12 points)
  sensorHistory.push({
    soilMoisture: currentSimulatedData.soilMoisture,
    temperature: currentSimulatedData.temperature,
    humidity: currentSimulatedData.humidity,
    rain: currentSimulatedData.rain ? 1 : 0
  });
  
  if (sensorHistory.length > 12) {
    sensorHistory.shift();
  }
}

// Start the iterative simulation
(function loop() {
  setTimeout(async () => {
    await runMLInference();
    loop();
  }, 3000);
})();

