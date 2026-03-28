import { Router, type IRouter } from "express";
import { GetRecommendationResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const recommendations = [
  {
    cropCondition: "Moderate - Crop is growing but showing signs of nutrient stress",
    identifiedIssue: "Low Nitrogen levels causing leaf yellowing",
    riskLevel: "medium",
    suggestedActions: [
      "Apply Urea fertilizer at 50 kg/hectare",
      "Increase irrigation frequency to twice daily",
      "Monitor leaves for further yellowing in next 5 days",
      "Avoid applying fertilizer before heavy rain",
    ],
    fertilizerRecommendation: {
      name: "Iffco NPK 12-32-16",
      npkRatio: "12-32-16",
      usageInfo: "Apply 50 kg per hectare. Mix with irrigation water for best results. Apply in early morning or evening.",
      buyLink: "https://www.amazon.in/s?k=iffco+npk+fertilizer",
      platform: "Amazon",
    },
  },
  {
    cropCondition: "Good - Crop is healthy with optimal moisture levels",
    identifiedIssue: "No significant issues detected",
    riskLevel: "low",
    suggestedActions: [
      "Maintain current irrigation schedule",
      "Apply balanced NPK fertilizer next week",
      "Check for pest activity around crop borders",
      "Continue soil moisture monitoring",
    ],
    fertilizerRecommendation: {
      name: "Coromandel Gromor 14-35-14",
      npkRatio: "14-35-14",
      usageInfo: "Apply 40 kg per hectare during active growth phase. Suitable for most crops.",
      buyLink: "https://www.amazon.in/s?k=coromandel+fertilizer+14-35-14",
      platform: "Amazon",
    },
  },
  {
    cropCondition: "Poor - Crop shows signs of severe water stress and nutrient deficiency",
    identifiedIssue: "Very low soil moisture combined with Potassium deficiency",
    riskLevel: "high",
    suggestedActions: [
      "Immediately start irrigation — soil moisture critically low",
      "Apply Muriate of Potash (MOP) at 60 kg/hectare",
      "Check irrigation system for leaks or blockages",
      "Apply foliar spray with micronutrients within 24 hours",
      "Consider crop protection from heat stress",
    ],
    fertilizerRecommendation: {
      name: "SQM Potassium Nitrate",
      npkRatio: "13-0-46",
      usageInfo: "Apply 30 kg per hectare. Dissolve in water and apply as foliar spray or through drip irrigation.",
      buyLink: "https://www.amazon.in/s?k=potassium+nitrate+fertilizer",
      platform: "Amazon",
    },
  },
];

let recIndex = 0;

router.get("/recommendation", (_req, res) => {
  recIndex = (recIndex + 1) % recommendations.length;
  const rec = recommendations[recIndex];

  const data = GetRecommendationResponse.parse(rec);
  res.json(data);
});

export default router;
