import { Router, type IRouter } from "express";
import { simulatorConfig } from "../lib/shared-state";
import { fetchSatelliteHeatmap } from "../services/satellite-service";
import { fetchWeatherData } from "../services/weather-service";

const router: IRouter = Router();

// Precision Resource Optimizer Engine
function calculateCellResources(row: number, col: number, weather: any) {
  // Use coordinates for deterministic variance (pseudo-random but stable)
  const coordFactor = (Math.sin(row * 0.9) + Math.cos(col * 0.9));
  const baseMoisture = 35 + (coordFactor * 15); 
  
  // Weather stress impact
  const tempStress = weather.temp > 33 ? (weather.temp - 33) * 2.5 : 0;
  const humidityModifier = (weather.humidity > 80) ? (weather.humidity - 80) * 1.2 : (45 - weather.humidity) * 0.5;
  const totalStress = Math.max(0, Math.min(100, (100 - baseMoisture) + tempStress + (humidityModifier > 0 ? humidityModifier : 0)));

  // Deterministic Disease Risk (stable per cell)
  const diseaseRiskBase = (Math.sin(row * 1.5) * Math.cos(col * 1.5) + 1) / 2; // 0 to 1
  const diseaseRisk = (weather.humidity > 75 && weather.temp < 28) ? diseaseRiskBase * 80 : diseaseRiskBase * 20;

  let status = "Healthy";
  let color = "#10b981"; // Emerald-500
  let recommendations = ["Health Optimal"];
  let needs = { water: 0, n: 0, p: 0, k: 0, pesticide: 0 };

  // Explicit deficiency Logic
  if (totalStress > 55 || diseaseRisk > 65) {
    status = "Critical"; 
    color = "#ef4444"; // Red-500
    
    // Deterministic needs based on coords
    const nNeed = ((row + col) % 3 === 0) ? 40 : 0;
    const pNeed = ((row * col) % 4 === 0) ? 22 : 0;
    const kNeed = ((row + col) % 5 === 0) ? 18 : 0;

    needs = { 
       water: totalStress > 50 ? 5.0 + (totalStress * 0.08) : 0, 
       n: nNeed,
       p: pNeed,
       k: kNeed,
       pesticide: diseaseRisk > 65 ? 0.8 : 0
    };
    
    if (diseaseRisk > 65) recommendations = ["Apply Bio-Pesticide", "Manual Scouting Needed"];
    else if (totalStress > 70) recommendations = ["Immediate Irrigation", "Emergency NPK Application"];
    else recommendations = ["Corrective Fertilization", "Enhanced Irrigation"];

  } else if (totalStress > 30 || diseaseRisk > 35) {
    status = "Moderate";
    color = "#f59e0b"; // Amber-500
    needs = { 
        water: totalStress > 30 ? 2.5 : 0, 
        n: 10, p: 5, k: 4, 
        pesticide: diseaseRisk > 35 ? 0.3 : 0 
    };
    recommendations = ["Schedule Maintenance", "Preventative Spraying"];
  }

  return { id: `P-${row}${col}`, status, color, totalStress, diseaseRisk, needs, recommendations };
}

router.get("/precision-farming/data", async (req, res) => {
  try {
    const bboxParam = req.query.bbox as string;
    const polygonParam = req.query.polygon as string; // Optional polygon
    
    const bbox = bboxParam ? JSON.parse(bboxParam) : [73.85, 18.51, 73.86, 18.53];
    const polygon = polygonParam ? JSON.parse(polygonParam) : null;

    const centerLat = (bbox[1] + bbox[3]) / 2;
    const centerLon = (bbox[0] + bbox[2]) / 2;
    const weather = await fetchWeatherData(centerLat, centerLon);
    
    const heatmapData = await fetchSatelliteHeatmap(bbox);
    
    const gridSize = 10;
    const grid: any[] = [];
    
    // Scale resources based on area if polygon is provided
    // 1-Hectare is 10,000 sqm. If polygon is smaller/larger, we scale.
    let areaScale = 1.0;
    if (polygon && polygon.length > 2) {
       // Simple area approximation (rough)
       const latDist = Math.abs(bbox[3] - bbox[1]) * 111000;
       const lonDist = Math.abs(bbox[2] - bbox[0]) * 111000 * Math.cos(centerLat * Math.PI / 180);
       const areaSqm = latDist * lonDist * 0.7; // 0.7 factor for irregular shape approx
       areaScale = Math.max(0.2, Math.min(2.5, areaSqm / 10000));
    }

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = calculateCellResources(r, c, weather);
        // Adjust needs based on area scale
        cell.needs.water *= areaScale;
        cell.needs.n *= areaScale;
        cell.needs.p *= areaScale;
        cell.needs.k *= areaScale;
        grid.push(cell);
      }
    }

    res.json({
      weather,
      grid,
      parcel: {
        center: [centerLat, centerLon],
        boundary: polygon || bbox,
        type: "Agricultural/Land",
        areaScale: Number(areaScale.toFixed(2))
      },
      heatmap: heatmapData?.image || null,
      bbox: heatmapData?.bbox || bbox,
      summary: {
        totalWater: Math.round(grid.reduce((acc, cell) => acc + (cell.needs.water || 0), 0)),
        totalNitrogen: Math.round(grid.reduce((acc, cell) => acc + (cell.needs.n || 0), 0)),
        totalPhosphorous: Math.round(grid.reduce((acc, cell) => acc + (cell.needs.p || 0), 0)),
        totalPotassium: Math.round(grid.reduce((acc, cell) => acc + (cell.needs.k || 0), 0)),
        totalPesticide: Number(grid.reduce((acc, cell) => acc + (cell.needs.pesticide || 0), 0).toFixed(1)),
        criticalSquares: grid.filter(c => c.status === "Critical").length,
        moderateSquares: grid.filter(c => c.status === "Moderate").length,
        healthySquares: grid.filter(c => c.status === "Healthy").length,
      }
    });

  } catch (error: any) {
    console.error("Precision Data Engine Error:", error);
    res.status(500).json({ error: "Failed to fetch precision data", details: error.message });
  }
});

export default router;
