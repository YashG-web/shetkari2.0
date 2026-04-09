import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const FERTILIZER_LABEL_MAP: Record<string, string> = {
  "Balanced NPK": "Iffco NPK 12-32-16",
  "Compost": "Organic Compost",
  "DAP": "DAP 18-46-0",
  "Potash": "Muriate of Potash",
  "Urea": "Urea 46-0-0",
};

export type FertilizerSource = "AI" | "Fallback";

function normalizeFertilizerLabel(label: string): string {
  return FERTILIZER_LABEL_MAP[label] ?? label;
}

export function getRuleBasedFertilizerRecommendation(data: {
  soilMoisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
}): string {
  if (data.soilMoisture < 35) {
    return "Liquid Humic Acid";
  }
  if (data.nitrogen < 40 || data.phosphorus < 25 || data.potassium < 40) {
    return "Iffco NPK 12-32-16";
  }
  if (data.temperature > 38) {
    return "Seaweed Extract";
  }
  return "Coromandel Gromor 14-35-14";
}

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
  tsForecastData: [] as { time: string, value: number }[],
  fertilizerRecommendation: "Coromandel Gromor 14-35-14",
  fertilizerSource: "Fallback" as FertilizerSource
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
  if (temp > 38) insights.push("🔥 Extreme heat detected.");
  
  // Nutrient insights
  if (currentSimulatedData.nitrogen < 120) insights.push("📉 Nitrogen levels are dropping due to crop uptake/leaching.");
  if (currentSimulatedData.nitrogen < 80) insights.push("⚠️ Alert: Severe Nitrogen deficiency detected.");
  
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
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const currentNitrogen = typeof current.nitrogen === "number" ? current.nitrogen : nitrogen;
  const currentPhosphorus = typeof current.phosphorus === "number" ? current.phosphorus : phosphorus;
  const currentPotassium = typeof current.potassium === "number" ? current.potassium : potassium;

  const heatStress = Math.max(0, temperature - 30);
  const lowHumidityStress = Math.max(0, 45 - humidity);
  const moistureActivity = Math.max(0, newMoisture - 55);
  const dryStress = Math.max(0, 35 - newMoisture);
  const rainLeaching = rain ? 1.5 : 0;

  const nitrogenLoss = rainLeaching * 1.2 + heatStress * 0.08 + lowHumidityStress * 0.05 + moistureActivity * 0.03 + dryStress * 0.04;
  const phosphorusLoss = rainLeaching * 0.4 + heatStress * 0.03 + lowHumidityStress * 0.02 + moistureActivity * 0.02 + dryStress * 0.02;
  const potassiumLoss = rainLeaching * 0.7 + heatStress * 0.05 + lowHumidityStress * 0.03 + moistureActivity * 0.025 + dryStress * 0.03;

  const baselineReturnRate = 0.03;
  const nextNitrogen = Number(clamp(
    currentNitrogen + (nitrogen - currentNitrogen) * baselineReturnRate - nitrogenLoss + (Math.random() - 0.5) * 1.2,
    0,
    300
  ).toFixed(1));
  const nextPhosphorus = Number(clamp(
    currentPhosphorus + (phosphorus - currentPhosphorus) * baselineReturnRate - phosphorusLoss + (Math.random() - 0.5) * 0.8,
    0,
    300
  ).toFixed(1));
  const nextPotassium = Number(clamp(
    currentPotassium + (potassium - currentPotassium) * baselineReturnRate - potassiumLoss + (Math.random() - 0.5) * 1.0,
    0,
    300
  ).toFixed(1));

  const nextSoilMoisture = Number(newMoisture.toFixed(1));

  // Determine fallback recommendation for this physical step
  const fallbackFertilizerRecommendation = getRuleBasedFertilizerRecommendation({
    soilMoisture: nextSoilMoisture,
    nitrogen: nextNitrogen,
    phosphorus: nextPhosphorus,
    potassium: nextPotassium,
    temperature: jitter(temperature, 1),
  });

  return {
    timestamp: new Date().toISOString(),
    soilMoisture: nextSoilMoisture,
    temperature: jitter(temperature, 1),
    humidity: jitter(humidity, 2),
    rain,
    nitrogen: nextNitrogen,
    phosphorus: nextPhosphorus,
    potassium: nextPotassium,
    pH: Number((pH + (Math.random() - 0.5) * 0.1).toFixed(2)),
    
    // Default ML fields for sync compatibility
    lstmOutput: 0,
    rfOutput: "OFF",
    regressionOutput: 0,
    ruleEngineOutput: "Simulating...",
    rfPrediction: nextSoilMoisture,
    dtInsights: ["Sync simulation step"],
    tsForecastData: [],
    fertilizerRecommendation: fallbackFertilizerRecommendation,
    fertilizerSource: "Fallback"
  };
}


// Async loop to fetch real ML predictions
async function runMLInference() {
  const data = calculateStep(simulatorConfig, currentSimulatedData);
  const mlData: any = { ...data };
  const fallbackFertilizer = getRuleBasedFertilizerRecommendation({
    soilMoisture: data.soilMoisture,
    nitrogen: data.nitrogen,
    phosphorus: data.phosphorus,
    potassium: data.potassium,
    temperature: data.temperature,
  });
  mlData.fertilizerRecommendation = fallbackFertilizer;
  mlData.fertilizerSource = "Fallback";

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
    // Silencing log spam when ML service is offline
    console.debug("ML Inference unavailable - using rule-based fallback.");
    mlData.rfPrediction = data.soilMoisture;
    mlData.dtInsights = ["AI Service temporarily offline. Using rule-based fallback."];
    mlData.tsForecastData = [];
    mlData.fertilizerRecommendation = fallbackFertilizer;
    mlData.fertilizerSource = "Fallback";
    // Fallback: controlMoisture remains the raw data.soilMoisture from above
  }

  try {
    const fertilizerResponse = await axios.post(`${ML_SERVICE_URL}/predict/fertilizer`, {
      N: data.nitrogen,
      P: data.phosphorus,
      K: data.potassium,
      temperature: data.temperature,
      humidity: data.humidity,
      soilMoisture: data.soilMoisture
    }, { timeout: 1000 });

    const recommendedFertilizer = fertilizerResponse.data?.recommended_fertilizer;
    if (typeof recommendedFertilizer === "string" && recommendedFertilizer.trim().length > 0) {
      mlData.fertilizerRecommendation = normalizeFertilizerLabel(recommendedFertilizer.trim());
      mlData.fertilizerSource = "AI";
    }
  } catch (error: any) {
    // Silencing log spam
    console.debug("Fertilizer AI unavailable - using static recommendation.");
    mlData.fertilizerRecommendation = fallbackFertilizer;
    mlData.fertilizerSource = "Fallback";
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

