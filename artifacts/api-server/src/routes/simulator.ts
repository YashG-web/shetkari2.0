import { Router, type IRouter } from "express";
import { GetSimulatorConfigResponse, UpdateSimulatorConfigBody, GetLatestSimulatorDataResponse, type Types } from "@workspace/api-zod";
import { simulatorConfig, currentSimulatedData, updateConfig, calculateStep, runMLInference } from "../lib/shared-state";

const router: IRouter = Router();

router.get("/simulator/config", (req, res) => {
  res.json(GetSimulatorConfigResponse.parse(simulatorConfig));
});

router.post("/simulator/config", async (req, res) => {
  const body = UpdateSimulatorConfigBody.parse(req.body);
  
  // Ensure we don't pass undefined to a required boolean field
  const configUpdate = {
    ...body,
    enabled: body.enabled ?? simulatorConfig.enabled
  };
  
  updateConfig(configUpdate);
  
  // Instant trigger for real-time responsiveness
  runMLInference().catch(err => console.error("Immediate ML trigger failed", err));
  
  res.json(GetSimulatorConfigResponse.parse(simulatorConfig));
});

router.get("/simulator/latest", (req, res) => {
  res.json(GetLatestSimulatorDataResponse.parse(currentSimulatedData));
});

router.post("/simulator/bulk", (req, res) => {
  const { duration } = req.body;
  let points = 720; // 1 month hourly
  if (duration === "3-months") points = 2160;
  if (duration === "6-months") points = 4320;
  if (duration === "1-year") points = 8760;

  const csvRows = [
    "timestamp,soilMoisture,temperature,humidity,rain,nitrogen,phosphorus,potassium,pH,lstmOutput,rfOutput,regressionOutput,ruleEngineOutput"
  ];

  let tempState = { ...currentSimulatedData };
  const now = Date.now();

  for (let i = 0; i < points; i++) {
    const time = new Date(now - (points - i) * 3600000).toISOString();
    tempState = calculateStep(simulatorConfig, tempState);
    tempState.timestamp = time;
    
    csvRows.push([
      tempState.timestamp,
      tempState.soilMoisture,
      tempState.temperature,
      tempState.humidity,
      tempState.rain,
      tempState.nitrogen,
      tempState.phosphorus,
      tempState.potassium,
      tempState.pH,
      tempState.lstmOutput || "",
      tempState.rfOutput || "",
      tempState.regressionOutput || "",
      tempState.ruleEngineOutput || ""
    ].join(","));
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=farm_simulation_${duration}.csv`);
  res.send(csvRows.join("\n"));
});

export default router;
