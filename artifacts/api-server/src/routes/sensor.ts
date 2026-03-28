import { Router, type IRouter } from "express";
import { GetSensorDataResponse } from "@workspace/api-zod";

const router: IRouter = Router();

let lastValues = {
  soilMoisture: 65,
  temperature: 28,
  humidity: 72,
  nitrogen: 45,
  phosphorus: 30,
  potassium: 55,
  pumpStatus: "OFF" as "ON" | "OFF",
};

function fluctuate(value: number, range: number, min: number, max: number): number {
  const delta = (Math.random() - 0.5) * 2 * range;
  return Math.min(max, Math.max(min, +(value + delta).toFixed(1)));
}

router.get("/sensor-data", (_req, res) => {
  lastValues = {
    soilMoisture: fluctuate(lastValues.soilMoisture, 2, 10, 100),
    temperature: fluctuate(lastValues.temperature, 0.5, 10, 45),
    humidity: fluctuate(lastValues.humidity, 2, 20, 100),
    nitrogen: fluctuate(lastValues.nitrogen, 1.5, 5, 100),
    phosphorus: fluctuate(lastValues.phosphorus, 1, 5, 80),
    potassium: fluctuate(lastValues.potassium, 1.5, 5, 100),
    pumpStatus: lastValues.soilMoisture < 40 ? "ON" : "OFF",
  };

  const data = GetSensorDataResponse.parse({
    ...lastValues,
    connectedAt: new Date().toISOString(),
  });

  res.json(data);
});

export default router;
