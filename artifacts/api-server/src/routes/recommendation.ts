import { Router, type IRouter } from "express";
import { GetRecommendationResponse, type Types } from "@workspace/api-zod";
import { currentSimulatedData, getRuleBasedFertilizerRecommendation } from "../lib/shared-state";
import axios from "axios";

const router: IRouter = Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const FERTILIZER_CATALOG: Record<string, Types.FertilizerRecommendation> = {
  "Liquid Humic Acid": {
    name: "Liquid Humic Acid",
    npkRatio: "0-0-0",
    usageInfo: "Apply 5L per hectare via irrigation to improve water retention and soil structure.",
    buyLink: "https://www.amazon.in/s?k=humic+acid+fertilizer",
    platform: "Amazon",
    app_strategy: "Soil Drenching",
    app_desc: "Mix with irrigation water for deep soil penetration."
  },
  "Iffco NPK 12-32-16": {
    name: "Iffco NPK 12-32-16",
    npkRatio: "12-32-16",
    usageInfo: "Apply 50 kg per hectare. Suitable for all field crops during vegetative stage.",
    buyLink: "https://www.amazon.in/s?k=iffco+npk+fertilizer",
    platform: "Amazon",
    app_strategy: "Basal Application",
    app_desc: "Apply near the root zone during sowing or early growth."
  },
  "Seaweed Extract": {
    name: "Seaweed Extract",
    npkRatio: "1-0-1",
    usageInfo: "Spray 2ml per Liter of water as foliar spray to help plants cope with abiotic stress.",
    buyLink: "https://www.amazon.in/s?k=seaweed+liquid+fertilizer",
    platform: "Amazon",
    app_strategy: "Foliar Spray",
    app_desc: "Spray directly on leaves during early morning or late evening."
  },
  "Coromandel Gromor 14-35-14": {
    name: "Coromandel Gromor 14-35-14",
    npkRatio: "14-35-14",
    usageInfo: "Periodic application as per crop cycle. No urgent requirement.",
    buyLink: "https://www.amazon.in/s?k=coromandel+fertilizer+14-35-14",
    platform: "Amazon",
    app_strategy: "Top Dressing",
    app_desc: "Spread evenly on the soil surface around the plants."
  },
  "Organic Compost": {
    name: "Organic Compost",
    npkRatio: "1-1-1",
    usageInfo: "Apply 1-2 tons per hectare and mix into topsoil before irrigation.",
    buyLink: "https://www.amazon.in/s?k=organic+compost+fertilizer",
    platform: "Amazon",
    app_strategy: "Soil Incorporation",
    app_desc: "Thoroughly mix into the top 6 inches of soil."
  },
  "DAP 18-46-0": {
    name: "DAP 18-46-0",
    npkRatio: "18-46-0",
    usageInfo: "Apply at sowing stage as per crop advisory, avoid direct root contact.",
    buyLink: "https://www.amazon.in/s?k=dap+fertilizer",
    platform: "Amazon",
    app_strategy: "Band Placement",
    app_desc: "Place in bands 5cm away from the seed row."
  },
  "Muriate of Potash": {
    name: "Muriate of Potash",
    npkRatio: "0-0-60",
    usageInfo: "Apply 20-40 kg per acre based on soil test for potassium correction.",
    buyLink: "https://www.amazon.in/s?k=muriate+of+potash",
    platform: "Amazon",
    app_strategy: "Split Application",
    app_desc: "Apply in two stages to prevent leaching in sandy soils."
  },
  "Urea 46-0-0": {
    name: "Urea 46-0-0",
    npkRatio: "46-0-0",
    usageInfo: "Split apply during vegetative stage and irrigate immediately after application.",
    buyLink: "https://www.amazon.in/s?k=urea+fertilizer",
    platform: "Amazon",
    app_strategy: "Broadcast & Irrigate",
    app_desc: "Spread on soil and water immediately to prevent nitrogen loss."
  },
};

function getFertilizerDetails(name: string): Types.FertilizerRecommendation {
  if (FERTILIZER_CATALOG[name]) {
    return FERTILIZER_CATALOG[name];
  }

  return {
    name,
    npkRatio: "N/A",
    usageInfo: "Follow agronomist guidance and soil test recommendations before application.",
    buyLink: "https://www.amazon.in/s?k=fertilizer",
    platform: "Amazon",
    app_strategy: "General Application",
    app_desc: "Consult a local agricultural expert for specific application methods."
  };
}


router.get("/recommendation", async (_req, res) => {
  const { 
    soilMoisture, 
    nitrogen, 
    phosphorus, 
    potassium, 
    temperature, 
    humidity, 
    rain,
    fertilizerRecommendation,
    fertilizerSource,
  } = currentSimulatedData;

  const fallbackFertilizerName = getRuleBasedFertilizerRecommendation({
    soilMoisture,
    nitrogen,
    phosphorus,
    potassium,
    temperature,
  });

  const hasStoredFertilizer =
    typeof fertilizerRecommendation === "string" && fertilizerRecommendation.trim().length > 0;
  const selectedFertilizerName =
    hasStoredFertilizer && fertilizerSource === "AI"
      ? fertilizerRecommendation.trim()
      : fallbackFertilizerName;
  const selectedFertilizer = getFertilizerDetails(selectedFertilizerName);

  // Attempt to get ML-driven prediction using Random Forest
  let predictedMoisture: number | null = null;
  try {
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/soil-moisture`, {
      temperature,
      humidity,
      rain: rain ? 1 : 0,
      prev_moisture: soilMoisture
    }, { timeout: 1000 }); // Short timeout to avoid blocking

    if (mlResponse.data && mlResponse.data.predictedMoisture !== undefined) {
      predictedMoisture = mlResponse.data.predictedMoisture;
    }
  } catch (err) {
    console.error("ML Recommendation fetch failed, falling back to rule-based logic.");
  }

  let rec;
  const predictionSuffix = predictedMoisture !== null
    ? ` (ML Forecast: ${predictedMoisture}% moisture in next step)` 
    : "";

  let irrigationAdvisory = "Soil moisture is stable. No immediate irrigation needed.";
  if (rain) {
    irrigationAdvisory = "Rain detected. Natural irrigation sufficient. Keep pumps off.";
  } else if (soilMoisture < 35) {
    irrigationAdvisory = "Critical: Soil is too dry. Immediate irrigation required.";
  } else if (temperature > 38) {
    irrigationAdvisory = "High evaporation alert. Supplemental irrigation recommended.";
  } else if (humidity > 85) {
    irrigationAdvisory = "High humidity. Reduced transpiration. Water sparingly to avoid fungal risk.";
  } else if (soilMoisture > 75) {
    irrigationAdvisory = "Soil is well-saturated. Irrigation not required.";
  }


  if (soilMoisture < 35) {
    rec = {
      cropCondition: "Poor - Crop shows signs of severe water stress" + predictionSuffix,
      identifiedIssue: "Critically low soil moisture detected",
      riskLevel: "high",
      suggestedActions: [
        "Immediately start irrigation cycle",
        "Check soil for crusting or hydrophobic behavior",
        "Monitor temperature to prevent heat shock",
        "Add organic mulch to retain moisture"
      ],
      fertilizerRecommendation: selectedFertilizer,
      irrigationAdvisory,
      app_strategy: selectedFertilizer.app_strategy,
      app_desc: selectedFertilizer.app_desc
    };


  } else if (nitrogen < 40 || phosphorus < 25 || potassium < 40) {
    rec = {
      cropCondition: "Moderate - Potential nutrient deficiency detected" + predictionSuffix,
      identifiedIssue: "Low NPK levels causing stunted growth or leaf discoloration",
      riskLevel: "medium",
      suggestedActions: [
        "Apply balanced NPK fertilizer within 48 hours",
        "Perform a leaf tissue test for micronutrient check",
        "Adjust irrigation to ensure nutrient uptake",
        "Ensure soil pH is between 6.0 and 7.0"
      ],
      fertilizerRecommendation: selectedFertilizer,
      irrigationAdvisory,
      app_strategy: selectedFertilizer.app_strategy,
      app_desc: selectedFertilizer.app_desc
    };


  } else if (temperature > 38) {
    rec = {
      cropCondition: "Moderate - Heat stress warning" + predictionSuffix,
      identifiedIssue: "High ambient temperature causing transpiration stress",
      riskLevel: "medium",
      suggestedActions: [
        "Use misting or overhead irrigation for cooling",
        "Avoid mid-day field activities",
        "Monitor for leaf wilting",
        "Check for pest outbreaks which are common in heat"
      ],
      fertilizerRecommendation: selectedFertilizer,
      irrigationAdvisory,
      app_strategy: selectedFertilizer.app_strategy,
      app_desc: selectedFertilizer.app_desc
    };


  } else {
    rec = {
      cropCondition: "Good - Optimal growing conditions" + predictionSuffix,
      identifiedIssue: "No significant issues detected",
      riskLevel: "low",
      suggestedActions: [
        "Maintain current management practices",
        "Scout field for early signs of pests/diseases",
        "Continue real-time monitoring",
        "Clean irrigation filters"
      ],
      fertilizerRecommendation: selectedFertilizer,
      irrigationAdvisory,
      app_strategy: selectedFertilizer.app_strategy,
      app_desc: selectedFertilizer.app_desc
    };


  }

  irrigationAdvisory = currentSimulatedData.irrigationAdvisory || irrigationAdvisory;


  const data = {
    ...rec,
    irrigationAdvisory
  };

  res.json(data);
});


export default router;
