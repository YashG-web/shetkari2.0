import { Router, type IRouter } from "express";
import { GetRecommendationResponse } from "@workspace/api-zod";
import { currentSimulatedData } from "../lib/shared-state";
import axios from "axios";

const router: IRouter = Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

router.get("/recommendation", async (_req, res) => {
  const { 
    soilMoisture, 
    nitrogen, 
    phosphorus, 
    potassium, 
    temperature, 
    humidity, 
    rain 
  } = currentSimulatedData;

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
  const predictionSuffix = predictedMoisture 
    ? ` (ML Forecast: ${predictedMoisture}% moisture in next step)` 
    : "";

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
      fertilizerRecommendation: {
        name: "Liquid Humic Acid",
        npkRatio: "0-0-0",
        usageInfo: "Apply 5L per hectare via irrigation to improve water retention and soil structure.",
        buyLink: "https://www.amazon.in/s?k=humic+acid+fertilizer",
        platform: "Amazon",
      }
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
      fertilizerRecommendation: {
        name: "Iffco NPK 12-32-16",
        npkRatio: "12-32-16",
        usageInfo: "Apply 50 kg per hectare. Suitable for all field crops during vegetative stage.",
        buyLink: "https://www.amazon.in/s?k=iffco+npk+fertilizer",
        platform: "Amazon",
      }
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
      fertilizerRecommendation: {
        name: "Seaweed Extract",
        npkRatio: "1-0-1",
        usageInfo: "Spray 2ml per Liter of water as foliar spray to help plants cope with abiotic stress.",
        buyLink: "https://www.amazon.in/s?k=seaweed+liquid+fertilizer",
        platform: "Amazon",
      }
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
      fertilizerRecommendation: {
        name: "Coromandel Gromor 14-35-14",
        npkRatio: "14-35-14",
        usageInfo: "Periodic application as per crop cycle. No urgent requirement.",
        buyLink: "https://www.amazon.in/s?k=coromandel+fertilizer+14-35-14",
        platform: "Amazon",
      }
    };
  }

  const data = GetRecommendationResponse.parse(rec);
  res.json(data);
});


export default router;
