import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";
const ESP32_BASE_URL = process.env.ESP32_BASE_URL || "http://10.154.16.104/";

function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
  return Number(((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min).toFixed(2));
}

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

// Simulation Constants
const NUTRIENT_BASE_DECAY = { N: 0.12, P: 0.04, K: 0.02 };
const RAIN_DILUTION_FACTOR = 1.3;
const TEMPERATURE_STRESS_THRESHOLD = 30;
const ML_TRIGGER_THRESHOLD = 5.0; // Total NPK change sum

// Last state tracking to optimize ML calls
let lastMlNpk = { nitrogen: 0, phosphorus: 0, potassium: 0 };

// Global live mode state
let liveModeEnabled = false;
let lastLiveData = {
  soilMoisture: 50,
  temperature: 25,
  humidity: 60
};

export function getRuleBasedFertilizerRecommendation(data: {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}): string {
  // Purely NPK based
  if (data.nitrogen < 40) return "Urea 46-0-0";
  if (data.phosphorus < 30) return "DAP 18-46-0";
  if (data.potassium < 40) return "Muriate of Potash";
  if (data.nitrogen < 80) return "Ammonium Sulphate";
  
  return "Coromandel Gromor 14-35-14";
}

export function getIrrigationAdvisory(data: {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  rain: boolean;
}): string {
  if (data.rain) return "Rain detected. Natural irrigation sufficient. Keep pumps off.";
  if (data.soilMoisture < 30) return "Critical: Soil is too dry. Immediate irrigation required.";
  if (data.soilMoisture < 45 && data.temperature > 35) return "High evaporation alert. Supplemental irrigation recommended.";
  if (data.humidity > 85) return "High humidity. Reduced transpiration. Water sparingly to avoid fungal risk.";
  if (data.soilMoisture > 75) return "Soil is well-saturated. Irrigation not required.";
  
  return "Soil moisture is stable. No immediate irrigation needed.";
}

// Shared simulation state for all routes
export let simulatorConfig = {
  enabled: true,
  models: {
    randomForest: true,
    regression: true,
    lstm: true,
    ruleEngine: true,
    growthAI: true,
  },
  controls: {
    temperature: 25,
    humidity: 60,
    rain: false,
    soilMoisture: 50,
    nitrogen: 120,
    phosphorus: 60,
    potassium: 80,
    pH: 6.5,
  },
};

export let currentSimulatedData: any = {
  timestamp: new Date().toISOString(),
  soilMoisture: 50,
  temperature: 25,
  humidity: 60,
  rain: false,
  nitrogen: 120,
  phosphorus: 60,
  potassium: 80,
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
  fertilizerSource: "Fallback" as FertilizerSource,
  irrigationAdvisory: "Analyzing soil moisture...",
  growthStage: "Young Bud",
  growthConfidence: 94.2
};

let growthAge = 0; // Internal counter for simulation steps

export let sensorHistory: any[] = [];

export function updateConfig(newConfig: typeof simulatorConfig) {
  simulatorConfig = newConfig;
  
  // IMMEDIATE UPDATE: Force current state to match new user target instantly
  currentSimulatedData = {
    ...currentSimulatedData,
    temperature: newConfig.controls.temperature,
    humidity: newConfig.controls.humidity,
    rain: newConfig.controls.rain,
    nitrogen: newConfig.controls.nitrogen,
    phosphorus: newConfig.controls.phosphorus,
    potassium: newConfig.controls.potassium,
    pH: newConfig.controls.pH,
    soilMoisture: newConfig.controls.soilMoisture
  };
  
  console.log("🔄 Config Applied - Immediate State Update:", {
    N: currentSimulatedData.nitrogen,
    P: currentSimulatedData.phosphorus,
    K: currentSimulatedData.potassium,
    Moisture: currentSimulatedData.soilMoisture
  });
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
  if (currentSimulatedData.nitrogen < 80) insights.push("📉 Nitrogen levels are dropping due to crop uptake.");
  if (currentSimulatedData.nitrogen < 40) insights.push("⚠️ Alert: Severe Nitrogen deficiency detected.");
  
  if (insights.length === 0) insights.push("🍀 Environmental conditions are currently stable.");
  return insights;
}

// Logic to calculate the next simulation step (Physical only + Default ML fields)
export function calculateStep(config: typeof simulatorConfig, current: any) {
  const { temperature, humidity, rain, nitrogen, phosphorus, potassium, pH } = config.controls;
  
  let nextSoilMoisture = current.soilMoisture || 50;
  
  // Real-world Physics Model for Moisture (Requested Formulas)
  let moistureChange = 0;
  
  // Temperature dries the soil
  moistureChange -= (temperature * 0.02);
  
  // Humidity retains/adds moisture
  moistureChange += (humidity * 0.01);
  
  // Rain significantly increases moisture
  if (rain) {
    moistureChange += 2.0;
  }

  // Calculate next state
  nextSoilMoisture = Number((nextSoilMoisture + moistureChange).toFixed(1));
  
  // HARD CLAMP: Range 0 - 100
  nextSoilMoisture = Math.max(0, Math.min(100, nextSoilMoisture));

  console.log(`💧 Moisture: ${nextSoilMoisture}% (Δ: ${moistureChange.toFixed(3)})`);

  const jitter = (v: number, r: number) => Number((v + (Math.random() - 0.5) * r).toFixed(1));
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const currentNitrogen = typeof current.nitrogen === "number" ? current.nitrogen : nitrogen;
  const currentPhosphorus = typeof current.phosphorus === "number" ? current.phosphorus : phosphorus;
  const currentPotassium = typeof current.potassium === "number" ? current.potassium : potassium;

  // Realistic Nutrient Decay logic
  const heatStress = Math.max(0, temperature - TEMPERATURE_STRESS_THRESHOLD);
  const rainLeaching = rain ? RAIN_DILUTION_FACTOR : 1.0;

  // Nitrogen (N) is highly volatile and affected by heat/water
  const nitrogenLoss = (NUTRIENT_BASE_DECAY.N * rainLeaching) + (heatStress * 0.15);
  // Phosphorus (P) is very stable
  const phosphorusLoss = NUTRIENT_BASE_DECAY.P * (rain ? 1.1 : 1.0);
  // Potassium (K) is relatively stable
  const potassiumLoss = NUTRIENT_BASE_DECAY.K * (rain ? 1.15 : 1.0);

  const baselineReturnRate = 0.3; // FASTER SMOOTHING: 0.3 rate
  
  const nextNitrogen = Number(clamp(
    currentNitrogen + (nitrogen - currentNitrogen) * baselineReturnRate - nitrogenLoss + (Math.random() - 0.5) * 0.5,
    0,
    140
  ).toFixed(1));
  
  const nextPhosphorus = Number(clamp(
    currentPhosphorus + (phosphorus - currentPhosphorus) * baselineReturnRate - phosphorusLoss + (Math.random() - 0.5) * 0.2,
    0,
    140
  ).toFixed(1));
  
  const nextPotassium = Number(clamp(
    currentPotassium + (potassium - currentPotassium) * baselineReturnRate - potassiumLoss + (Math.random() - 0.5) * 0.2,
    0,
    140
  ).toFixed(1));

  // Determine fallback recommendation for this physical step
  const fallbackFertilizerRecommendation = getRuleBasedFertilizerRecommendation({
    nitrogen: nextNitrogen,
    phosphorus: nextPhosphorus,
    potassium: nextPotassium,
  });

  const irrigationAdvisory = getIrrigationAdvisory({
    soilMoisture: nextSoilMoisture,
    temperature: jitter(temperature, 1),
    humidity: jitter(humidity, 2),
    rain
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
    fertilizerSource: "Fallback",
    irrigationAdvisory,
    growthStage: current.growthStage || "Young Bud",
    growthConfidence: current.growthConfidence || 92.5
  };
}

// Logic to advance growth stages realistically
function calculateGrowthStage(age: number, nitrogen: number): { stage: string, confidence: number } {
  const stages = ["Young Bud", "Mature Bud", "Early Bloom", "Full Bloom", "Wilthed"];
  
  // Growth speed factor: nitrogen deficiency slows it down
  const deficiencyFactor = nitrogen < 40 ? 0.3 : 1.0;
  const stageIndex = Math.min(stages.length - 1, Math.floor(age / 50)); // Advance every 50 steps
  
  const stage = stages[stageIndex];
  const confidence = 85 + Math.random() * 12; // Realistic fluctuation
  
  return { stage, confidence: Number(confidence.toFixed(1)) };
}


// Async loop to fetch real ML predictions
export async function runMLInference(forceData?: any) {
  // If forceData is provided (IoT sync), use it directly. 
  // Otherwise, if simulator is on, calculate next physical step.
  // If simulator is off and no forceData, stay at current state.
  const data = forceData || (simulatorConfig.enabled 
    ? calculateStep(simulatorConfig, currentSimulatedData) 
    : currentSimulatedData);

  // Apply Live Mode Override: 
  // If we have live data and we are NOT forcing a specific point (from sync),
  // override the environmental values but keep the simulated NPK.
  if (liveModeEnabled && !forceData) {
    data.soilMoisture = lastLiveData.soilMoisture;
    data.temperature = lastLiveData.temperature;
    data.humidity = lastLiveData.humidity;
    console.log("📡 Live Mode Active: Overriding Env Sensors (Moisture/Temp/Hum) while preserving Simulated NPK");
  }

  const mlData: any = { ...data };
  
  // Persist the recommendation from previous step if we don't trigger AI
  mlData.fertilizerRecommendation = currentSimulatedData.fertilizerRecommendation;
  mlData.fertilizerSource = currentSimulatedData.fertilizerSource;

  // Use this as the "Source of Truth" for control decisions
  let controlMoisture = data.soilMoisture;

  try {
    // 1. Random Forest Prediction
    if (simulatorConfig.models.randomForest) {
      const rfResponse = await axios.post(`${ML_SERVICE_URL}/predict/soil-moisture?model_type=random_forest`, {
        temperature: data.temperature,
        humidity: data.humidity,
        rain: data.rain ? 1 : 0,
        prev_moisture: data.soilMoisture
      });
      mlData.rfPrediction = rfResponse.data.predictedMoisture;
      mlData.rfOutput = mlData.rfPrediction < 35 ? "ON" : "OFF"; 
      controlMoisture = mlData.rfPrediction;
    }

    // 2. Decision Tree Reasoning (Now under Regression mapping)
    if (simulatorConfig.models.regression) {
      mlData.dtInsights = generateDTInsights(controlMoisture, data.temperature, data.humidity, data.rain);
    } else {
      mlData.dtInsights = ["AI Reasoner disabled"];
    }
    
    // 3. LSTM/Time Series Forecasting
    if (simulatorConfig.models.lstm) {
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
    console.debug("ML Inference unavailable - using rule-based fallback.");
    mlData.rfPrediction = data.soilMoisture;
    mlData.dtInsights = ["AI Service temporarily offline."];
    mlData.tsForecastData = [];
  }

  // 4. ML Fertilizer Recommendation (Optimized Trigger)
  const npkChange = Math.abs(data.nitrogen - lastMlNpk.nitrogen) + 
                    Math.abs(data.phosphorus - lastMlNpk.phosphorus) + 
                    Math.abs(data.potassium - lastMlNpk.potassium);

  // NEAR REAL-TIME: If change is detected, we update it immediately in the next step
  if (npkChange > ML_TRIGGER_THRESHOLD) {
    try {
      const payload = {
        N: Math.max(0, Math.min(140, Number(data.nitrogen) || 0)),
        P: Math.max(0, Math.min(140, Number(data.phosphorus) || 0)),
        K: Math.max(0, Math.min(140, Number(data.potassium) || 0)),
        temperature: data.temperature,
        humidity: data.humidity,
        soilMoisture: data.soilMoisture
      };

      const fertilizerResponse = await axios.post(`${ML_SERVICE_URL}/predict/fertilizer`, payload, { timeout: 1500 });

      const recommendedFertilizer = fertilizerResponse.data?.recommended_fertilizer;
      if (recommendedFertilizer) {
        mlData.fertilizerRecommendation = normalizeFertilizerLabel(recommendedFertilizer.trim());
        mlData.fertilizerSource = "AI";
        lastMlNpk = { nitrogen: data.nitrogen, phosphorus: data.phosphorus, potassium: data.potassium };
      }
    } catch (error: any) {
      mlData.fertilizerSource = "Fallback";
    }
  }

  // 5. Rule Engine Automation (Irrigation Advisory)
  mlData.irrigationAdvisory = getIrrigationAdvisory({
    soilMoisture: controlMoisture,
    temperature: data.temperature,
    humidity: data.humidity,
    rain: data.rain
  });

  if (controlMoisture < 35 && !data.rain) {
    mlData.pumpStatus = "ON";
    mlData.ruleEngineOutput = "Irrigation system active";
  } else if (data.rain) {
    mlData.pumpStatus = "OFF";
    mlData.ruleEngineOutput = "Rain detected: Irrigation skipped";
  } else {
    mlData.pumpStatus = "OFF";
    mlData.ruleEngineOutput = "Soil moisture stable";
  }

  // 6. Growth Stage AI Simulation
  if (simulatorConfig.models.growthAI) {
    growthAge += 1;
    const growth = calculateGrowthStage(growthAge, data.nitrogen);
    mlData.growthStage = growth.stage;
    mlData.growthConfidence = growth.confidence;
  } else {
    mlData.growthStage = "AI Disabled";
    mlData.growthConfidence = 0;
  }

  currentSimulatedData = mlData;
  console.log("📊 Simulated Data Point:", {
    time: currentSimulatedData.timestamp.split('T')[1].split('.')[0],
    N: currentSimulatedData.nitrogen,
    P: currentSimulatedData.phosphorus,
    K: currentSimulatedData.potassium,
    Moisture: currentSimulatedData.soilMoisture
  });

  // History management
  sensorHistory.push({
    soilMoisture: currentSimulatedData.soilMoisture,
    temperature: currentSimulatedData.temperature,
    humidity: currentSimulatedData.humidity,
    rain: currentSimulatedData.rain ? 1 : 0
  });

  if (sensorHistory.length > 12) sensorHistory.shift();
}

// Global state for IoT connection
export let iotStatus: { status: "online" | "offline" | "connecting", lastError?: string } = { status: "connecting" };

// Start the iterative simulation (Faster refresh rate)
(function loop() {
  setTimeout(async () => {
    if (simulatorConfig.enabled) {
      await runMLInference();
    }
    // Background sync removed - now driven by frontend/direct IoT route
    loop();
  }, 200); 
})();

export async function updateStateFromIoT(data: { soilRaw: number, temperature: number, humidity: number }) {
  const soilMoisturePercent = map(data.soilRaw, 0, 1023, 100, 0);
  
  // Track live data for the simulation loop to use
  liveModeEnabled = true;
  lastLiveData = {
    soilMoisture: soilMoisturePercent,
    temperature: data.temperature,
    humidity: data.humidity
  };

  const newState = {
    ...currentSimulatedData,
    soilMoisture: soilMoisturePercent,
    temperature: data.temperature,
    humidity: data.humidity,
    timestamp: new Date().toISOString(),
  };

  currentSimulatedData = newState;
  iotStatus = { status: "online" };
  
  // Trigger ML inference with the ACTUAL hardware data (no simulation physics for this specific point)
  try {
    await runMLInference(newState);
  } catch (err) {
    console.error("ML Inference trigger failed during IoT sync", err);
  }
}

// Helper for immediate trigger on config change
export const triggerInstantML = runMLInference;

