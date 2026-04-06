import { Router, type IRouter } from "express";
import { GetWeatherResponse } from "@workspace/api-zod";
import { simulatorConfig } from "../lib/shared-state";

const router: IRouter = Router();

router.get("/weather", (_req, res) => {
  const { rain, temperature } = simulatorConfig.controls;

  let scenario;

  if (rain) {
    scenario = {
      condition: "Rainy",
      icon: "rain",
      description: "Atmospheric moisture levels are high, rainfall occurring.",
      alerts: [
        { type: "heavy-rain", message: "Moderate rainfall detected via simulation", severity: "medium" },
      ],
    };
  } else if (temperature > 35) {
    scenario = {
      condition: "Hot & Sunny",
      icon: "sunny",
      description: "Clear skies with high thermal activity.",
      alerts: [
        { type: "drought", message: "High heat warning: Possible crop stress", severity: "medium" },
      ],
    };
  } else if (temperature < 10) {
    scenario = {
      condition: "Cold",
      icon: "frost",
      description: "Low ambient temperatures, possible frost risk.",
      alerts: [
        { type: "frost", message: "Frost warning for sensitive crops", severity: "high" },
      ],
    };
  } else {
    scenario = {
      condition: "Clear",
      icon: "sunny",
      description: "Ideal conditions for open-field agriculture.",
      alerts: [],
    };
  }

  const data = GetWeatherResponse.parse(scenario);
  res.json(data);
});

export default router;
