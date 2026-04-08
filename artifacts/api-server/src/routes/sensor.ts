import { Router, type IRouter } from "express";
import { GetSensorDataResponse } from "@workspace/api-zod";
import { currentSimulatedData } from "../lib/shared-state";

const router: IRouter = Router();

router.get("/sensor-data", (_req, res) => {
  // Pull directly from simulation engine for real-time consistency
  const data = GetSensorDataResponse.parse({
    soilMoisture: currentSimulatedData.soilMoisture,
    temperature: currentSimulatedData.temperature,
    humidity: currentSimulatedData.humidity,
    nitrogen: currentSimulatedData.nitrogen,
    phosphorus: currentSimulatedData.phosphorus,
    potassium: currentSimulatedData.potassium,
    pumpStatus: currentSimulatedData.pumpStatus === "ON" ? "ON" : "OFF",
    connectedAt: currentSimulatedData.timestamp,
    // ML Fields
    rfPrediction: currentSimulatedData.rfPrediction,
    dtInsights: currentSimulatedData.dtInsights,
    tsForecastData: currentSimulatedData.tsForecastData,
    ruleEngineOutput: currentSimulatedData.ruleEngineOutput,
    fertilizerRecommendation: currentSimulatedData.fertilizerRecommendation,
    fertilizerSource: currentSimulatedData.fertilizerSource,
  });

  res.json(data);
});


export default router;
