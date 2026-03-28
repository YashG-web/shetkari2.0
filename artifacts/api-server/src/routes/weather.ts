import { Router, type IRouter } from "express";
import { GetWeatherResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const weatherScenarios = [
  {
    condition: "Sunny",
    icon: "sunny",
    description: "Clear skies, good conditions for fieldwork",
    alerts: [],
  },
  {
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
    description: "Mild cloud cover, moderate temperatures",
    alerts: [],
  },
  {
    condition: "Heavy Rain",
    icon: "rain",
    description: "Heavy rainfall expected, delay irrigation",
    alerts: [
      { type: "heavy-rain", message: "Heavy rain expected in next 2 hours", severity: "high" },
    ],
  },
  {
    condition: "Storm Warning",
    icon: "storm",
    description: "Severe storm approaching, secure crops",
    alerts: [
      { type: "storm", message: "Severe storm warning in effect", severity: "high" },
      { type: "heavy-rain", message: "Heavy rainfall accompanying storm", severity: "medium" },
    ],
  },
  {
    condition: "Cloudy",
    icon: "cloudy",
    description: "Overcast skies, cooler temperatures",
    alerts: [],
  },
];

let scenarioIndex = 0;

router.get("/weather", (_req, res) => {
  scenarioIndex = (scenarioIndex + 1) % weatherScenarios.length;
  const scenario = weatherScenarios[scenarioIndex];

  const data = GetWeatherResponse.parse(scenario);
  res.json(data);
});

export default router;
