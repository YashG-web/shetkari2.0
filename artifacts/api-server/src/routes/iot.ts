import { Router, type IRouter } from "express";
import axios from "axios";
import { iotStatus } from "../lib/shared-state";

const router: IRouter = Router();

const ESP32_BASE_URL = process.env.ESP32_BASE_URL || "http://10.154.16.92/";

function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
  return Number(((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min).toFixed(2));
}

router.get("/iot/live", async (req, res) => {
  try {
    const response = await axios.get(ESP32_BASE_URL, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });
    console.log("📡 Raw ESP32 Response Data:", response.data);

    // Support both JSON objects and potential string responses from simpler ESP servers
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    
    const soilRaw = data.soil ? parseInt(data.soil) : null;
    const temperature = data.temp ? parseFloat(data.temp) : null;
    const humidity = data.hum ? parseFloat(data.hum) : null;

    const soilMoisturePercent = soilRaw !== null ? map(soilRaw, 0, 1023, 0, 100) : null;

    res.json({
      source: "esp32",
      status: "online",
      soilRaw,
      soilMoisturePercent,
      temperature,
      humidity,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(503).json({
      source: "esp32",
      status: "offline",
      message: "ESP32 not reachable",
      error: error.message
    });
  }
});

router.get("/iot/status", (req, res) => {
  res.json(iotStatus);
});

router.post("/iot/sync", async (req, res) => {
  try {
    const { soilRaw, temperature, humidity } = req.body;
    
    if (soilRaw === undefined || temperature === undefined || humidity === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { updateStateFromIoT } = await import("../lib/shared-state");
    await updateStateFromIoT({ soilRaw, temperature, humidity });

    return res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err: any) {
    console.error("IoT Sync failed:", err);
    return res.status(500).json({ error: "Sync failed", details: err.message });
  }
});

export default router;
