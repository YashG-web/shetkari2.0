import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// Shared simulation state for all routes
export let simulatorConfig = {
  models: {
    randomForest: true,
    decisionTree: true,
    timeSeries: true,
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

  // Use this as the "Source of Truth" for control decisions
  let controlMoisture = data.soilMoisture;

  try {
    // 1. Random Forest Prediction (The "Accuracy" model)
    // Predicts the "true" moisture percentage by filtering out sensor noise.
    if (simulatorConfig.models.randomForest) {
      const rfResponse = await axios.post(`${ML_SERVICE_URL}/predict/soil-moisture?model_type=random_forest`, {
        temperature: data.temperature,
        humidity: data.humidity,
        rain: data.rain ? 1 : 0,
        prev_moisture: data.soilMoisture
      });
      mlData.rfPrediction = rfResponse.data.predictedMoisture;
      mlData.rfOutput = mlData.rfPrediction < 35 ? "ON" : "OFF"; // Advisory status
      
      // Update our "Control Source" to use the AI-optimized value
      controlMoisture = mlData.rfPrediction;
    }

    // 2. Decision Tree Reasoning (The "AI Reasoner")
    // Analyzes the environmental state to produce the "AI Reasoner" text insights.
    if (simulatorConfig.models.decisionTree) {
      // Use the RF-optimized value for more accurate reasoning context
      mlData.dtInsights = generateDTInsights(controlMoisture, data.temperature, data.humidity, data.rain);
    } else {
      mlData.dtInsights = ["AI Reasoner disabled"];
    }
    
    // 3. Time Series Forecasting (The "Forecasting" model)
    // Projects what the moisture will be for the next 7 hours.
    if (simulatorConfig.models.timeSeries) {
      const forecast: { time: string, value: number }[] = [];
      const tsResponse = await axios.post(`${ML_SERVICE_URL}/predict/forecast`, {
        lags: [controlMoisture, controlMoisture * 0.99, controlMoisture * 0.98]
      });
      
      const baselineForecast = tsResponse.data.forecast;
      for (let i = 1; i <= 7; i++) {
        const timeLabel = new Date(Date.now() + i * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const hourlyTrend = i * (data.rain ? 1.5 : -0.8);
        forecast.push({ 
          time: timeLabel, 
          value: Number((baselineForecast + hourlyTrend).toFixed(1))
        });
      }
      mlData.tsForecastData = forecast;
      mlData.regressionOutput = baselineForecast;
    }

  } catch (error: any) {
    console.error("ML Inference error in simulation loop:", error.message);
    mlData.rfPrediction = data.soilMoisture;
    mlData.dtInsights = ["AI Service temporarily offline. Using rule-based fallback."];
    mlData.tsForecastData = [];
    // Fallback: controlMoisture remains the raw data.soilMoisture from above
  }

  // 4. Rule Engine Automation (Coupled with AI/Accuracy Layer)
  // Now using controlMoisture (either AI-optimized or raw fallback)
  if (data.rain) {
    mlData.ruleEngineOutput = "Rain detected: Irrigation skipped";
    mlData.pumpStatus = "OFF";
  } else if (controlMoisture < 30) {
    mlData.ruleEngineOutput = `Critical: Auto-irrigation started (${simulatorConfig.models.randomForest ? "AI Trigger" : "Source: Raw"})`;
    mlData.pumpStatus = "ON";
  } else {
    mlData.ruleEngineOutput = "Optimal: No action required";
    mlData.pumpStatus = "OFF";
  }

  currentSimulatedData = mlData;

  // Update history buffer for models (keep last 12 points)
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

