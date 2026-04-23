import axios from "axios";

const CLIENT_ID = process.env.PLANET_CLIENT_ID || "";
const CLIENT_SECRET = process.env.PLANET_CLIENT_SECRET || "";
const BBOX = process.env.FARM_BBOX ? JSON.parse(process.env.FARM_BBOX) : [73.85, 18.51, 73.86, 18.53];

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get OAuth2 Access Token for Planet Insights (Sentinel Hub engine)
 */
async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID === "your_client_id_here") {
    console.warn("⚠️ Planet API credentials missing. Falling back to simulated data.");
    return null;
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);

    const response = await axios.post(
      "https://services.sentinel-hub.com/auth/realms/main/protocol/openid-connect/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000; // Buffer of 1 min
    return cachedToken;
  } catch (error: any) {
    console.error("❌ Failed to fetch Planet Access Token:", error.response?.data || error.message);
    return null;
  }
}

/**
 * Fetch Colorized NDMI (Moisture Stress) PNG heatmap from Planet Insights
 */
export async function fetchSatelliteHeatmap(bbox: number[] | null) {
  const token = await getAccessToken();
  if (!token) return null;

  const currentBbox = bbox || BBOX;

  // Evalscript for NDMI with a Red-Yellow-Green color ramp
  const evalscript = `
    //VERSION=3
    const moistureRamps = [
      [-0.4, 0xff0000], // Red: Critical stress
      [-0.1, 0xffa500], // Orange: Low moisture
      [0.1, 0xffff00],  // Yellow: Moderate
      [0.3, 0x90ee90],  // Light Green: Good
      [0.5, 0x008000]   // Dark Green: Healthy
    ];
    const viz = new ColorRampVisualizer(moistureRamps);
    function setup() {
      return {
        input: ["B08", "B11", "dataMask"],
        output: { bands: 4 }
      };
    }
    function evaluatePixel(samples) {
      let ndmi = (samples.B08 - samples.B11) / (samples.B08 + samples.B11);
      return [...viz.process(ndmi), samples.dataMask];
    }
  `;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const timeRange = {
    from: thirtyDaysAgo.toISOString(),
    to: now.toISOString()
  };

  const requestBody = {
    input: {
      bounds: {
        bbox: currentBbox,
        properties: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" }
      },
      data: [{ 
        type: "sentinel-2-l2a",
        dataFilter: {
          timeRange,
          mosaickingOrder: "mostRecent"
        }
      }]
    },
    output: {
      width: 512, // High-res image for overlay
      height: 512,
      responses: [{ identifier: "default", format: { type: "image/png" } }]
    },
    evalscript
  };

  try {
    const response = await axios.post(
      "https://services.sentinel-hub.com/api/v1/process",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "image/png"
        },
        responseType: "arraybuffer"
      }
    );

    // Convert binary PNG to Base64 for the frontend
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    return {
      image: `data:image/png;base64,${base64Image}`,
      bbox: currentBbox
    };
  } catch (error: any) {
    console.error("❌ Planet Heatmap API Error:", error.response?.data || error.message);
    return null;
  }
}
