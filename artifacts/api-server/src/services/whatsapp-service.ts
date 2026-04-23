import axios from "axios";
import { logger } from "../lib/logger";
import { currentSimulatedData } from "../lib/shared-state";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// ─── WhatsApp API Helpers ────────────────────────────────────────────────────

/**
 * Sends a text message reply via WhatsApp Business API (Meta Graph API).
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const phoneNumberId = process.env.PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    logger.warn("WhatsApp credentials not configured. Skipping send.");
    return;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    logger.info({ to }, "WhatsApp message sent successfully");
  } catch (err: any) {
    logger.error({ err: err?.response?.data || err?.message, to }, "Failed to send WhatsApp message");
  }
}

// ─── Intent Detection ────────────────────────────────────────────────────────

type Intent =
  | "irrigation"
  | "fertilizer"
  | "crop_health"
  | "weather"
  | "greeting"
  | "help"
  | "unknown";

function detectIntent(message: string): Intent {
  const lower = message.toLowerCase().trim();

  const patterns: [Intent, RegExp][] = [
    ["greeting",    /\b(hello|hi|namaskar|namaste|kem cho|helo|hey|hy)\b/i],
    ["help",        /\b(help|madad|sahayata|kaya kar|sahi karu|what can you do|options)\b/i],
    ["irrigation",  /\b(water|irrigation|paani|pani|soil|moisture|sechana|sukhe|dry|wet|jalsinchen|pump|bore)\b/i],
    ["fertilizer",  /\b(fertilizer|khad|khat|npk|nitrogen|phosphorus|potassium|urea|dap|manure|shet|nutrient)\b/i],
    ["crop_health", /\b(leaf|paan|disease|bimari|rog|yellow|piwal|wilting|pest|kida|fungal|spray|crop|pik|plant|ropa)\b/i],
    ["weather",     /\b(weather|hava|rain|paaus|temperature|temp|humidity|cloud|aabhal)\b/i],
  ];

  for (const [intent, pattern] of patterns) {
    if (pattern.test(lower)) return intent;
  }

  return "unknown";
}

// ─── ML-Backed Responses ─────────────────────────────────────────────────────

async function getFertilizerAdvice(): Promise<string> {
  const { nitrogen, phosphorus, potassium, temperature, humidity, soilMoisture } = currentSimulatedData;

  try {
    const res = await axios.post(
      `${ML_SERVICE_URL}/predict/fertilizer`,
      { N: nitrogen, P: phosphorus, K: potassium, temperature, humidity, soilMoisture },
      { timeout: 3000 }
    );

    const fertilizer: string = res.data?.recommended_fertilizer ?? "Balanced NPK";
    const confidence: number | undefined = res.data?.confidence;
    const conf = confidence !== undefined ? ` (Confidence: ${Math.round(confidence * 100)}%)` : "";

    return (
      `🌿 *Fertilizer Recommendation*${conf}\n` +
      `Based on current soil (N:${nitrogen.toFixed(0)}, P:${phosphorus.toFixed(0)}, K:${potassium.toFixed(0)}), ` +
      `use *${fertilizer}*.\n\n` +
      `📌 Apply as per label instructions. Irrigate after application for best results.`
    );
  } catch {
    // Rule-based fallback
    if (nitrogen < 40) return "🌿 Nitrogen is low. Apply *Urea (46-0-0)* or *DAP*. Water immediately after.";
    if (phosphorus < 25) return "🌿 Phosphorus deficient. Use *DAP 18-46-0*. Apply in bands near roots.";
    if (potassium < 40) return "🌿 Potassium low. Apply *Muriate of Potash (0-0-60)*. Split into 2 doses.";
    return "🌿 Your soil NPK levels look balanced. Use *Organic Compost* to maintain fertility.";
  }
}

async function getMoistureAdvice(): Promise<string> {
  const { soilMoisture, temperature, humidity, rain } = currentSimulatedData;

  try {
    const res = await axios.post(
      `${ML_SERVICE_URL}/predict/soil-moisture`,
      { temperature, humidity, rain: rain ? 1 : 0, prev_moisture: soilMoisture },
      { timeout: 3000 }
    );

    const predicted: number = res.data?.predictedMoisture ?? soilMoisture;
    const trend = predicted > soilMoisture ? "📈 rising" : predicted < soilMoisture ? "📉 falling" : "➡️ stable";

    let advice = "";
    if (soilMoisture < 40) {
      advice = "⚠️ *Critical:* Soil is very dry. Start irrigation *immediately*.";
    } else if (soilMoisture < 55) {
      advice = "💧 Soil moisture is low. Start irrigation within *1-2 hours*.";
    } else if (soilMoisture > 80) {
      advice = "✅ Soil is well-saturated. *No irrigation needed.* Watch for waterlogging.";
    } else if (rain) {
      advice = "🌧️ Rain detected. Natural irrigation sufficient. Turn *pumps off*.";
    } else {
      advice = "✅ Soil moisture is adequate. Monitor and irrigate if it drops below 50%.";
    }

    return (
      `💧 *Irrigation Status*\n` +
      `Current moisture: *${soilMoisture.toFixed(1)}%* | Trend: ${trend}\n` +
      `ML Forecast: *${predicted.toFixed(1)}%*\n\n` +
      advice
    );
  } catch {
    // Rule-based fallback
    if (soilMoisture < 50) return `💧 Soil moisture is *${soilMoisture.toFixed(1)}%* — too dry. Start irrigation now.`;
    return `✅ Soil moisture: *${soilMoisture.toFixed(1)}%* — Good. No irrigation needed currently.`;
  }
}

// ─── Rule-Based Responses ────────────────────────────────────────────────────

function getCropHealthAdvice(message: string): string {
  const lower = message.toLowerCase();

  if (/yellow|piwal|yellowing/.test(lower)) {
    return (
      "🍂 *Yellow Leaves Detected*\n\n" +
      "Possible causes:\n" +
      "• Nitrogen deficiency → Apply Urea\n" +
      "• Overwatering → Reduce irrigation\n" +
      "• Fungal infection → Apply fungicide\n" +
      "• Iron deficiency → Use chelated iron spray\n\n" +
      "Tip: Check soil drainage first."
    );
  }

  if (/wilting|murahlele|suki/.test(lower)) {
    return (
      "🥀 *Wilting Observed*\n\n" +
      "Likely cause: Low moisture or root rot.\n" +
      "• Check soil moisture immediately\n" +
      "• If dry: Irrigate slowly at root zone\n" +
      "• If wet: Improve drainage, check for root rot\n" +
      "• Avoid mid-day watering"
    );
  }

  if (/pest|kida|insect|bug/.test(lower)) {
    return (
      "🐛 *Pest Advisory*\n\n" +
      "• Identify pest species before spraying\n" +
      "• Use neem-based organic spray for mild infestations\n" +
      "• For severe cases: Consult a local agricultural officer\n" +
      "• Spray in early morning or evening\n" +
      "• Keep field records for pattern tracking"
    );
  }

  return (
    "🌿 *Crop Health Check*\n\n" +
    "General tips:\n" +
    "• Scout fields every 3-4 days for early signs\n" +
    "• Keep soil pH between 6.0 and 7.0\n" +
    "• Maintain proper irrigation and drainage\n" +
    "• Remove diseased plant material promptly\n\n" +
    "📸 Send a photo to SHETKARI's Crop Analysis page for AI diagnosis."
  );
}

function getWeatherAdvice(): string {
  const { temperature, humidity, rain } = currentSimulatedData;

  let summary = `🌡️ *Current Farm Conditions*\n`;
  summary += `Temperature: *${temperature.toFixed(1)}°C*\n`;
  summary += `Humidity: *${humidity.toFixed(1)}%*\n`;
  summary += `Rain: *${rain ? "Yes 🌧️" : "No ☀️"}*\n\n`;

  if (temperature > 38) summary += "⚠️ High heat alert! Use misting irrigation and avoid field work between 11am-3pm.";
  else if (temperature < 15) summary += "❄️ Cool conditions. Watch for frost risk and reduce irrigation.";
  else if (humidity > 85) summary += "💦 Very humid. Risk of fungal disease. Ensure good ventilation and reduce watering.";
  else if (rain) summary += "🌧️ Rain is active. Natural irrigation is sufficient. Pump off.";
  else summary += "✅ Conditions are favorable for field operations.";

  return summary;
}

function getGreeting(): string {
  return (
    "🌾 *Namaste! Welcome to SHETKARI AI Assistant*\n\n" +
    "I can help you with:\n" +
    "1️⃣ *Irrigation* – soil moisture & pump advice\n" +
    "2️⃣ *Fertilizer* – NPK recommendations\n" +
    "3️⃣ *Crop Health* – disease & pest guidance\n" +
    "4️⃣ *Weather* – current farm conditions\n\n" +
    "Just type your question in English, Hindi, or Marathi! 🙏"
  );
}

function getHelp(): string {
  return (
    "📋 *SHETKARI Assistant – Commands*\n\n" +
    "• *Water / Paani / Irrigation* – Soil moisture check\n" +
    "• *Fertilizer / Khad / NPK* – Fertilizer advice\n" +
    "• *Leaf / Crop / Disease* – Crop health tips\n" +
    "• *Weather / Hava / Rain* – Farm weather update\n" +
    "• *Hello / Namaste* – Start conversation\n\n" +
    "Powered by SHETKARI Smart Irrigation System 🚜"
  );
}

function getUnknownResponse(): string {
  return (
    "🤔 I didn't quite understand that. Here's what I can help with:\n\n" +
    "• *Paani / Water* – Irrigation advice\n" +
    "• *Khad / Fertilizer* – Fertilizer tips\n" +
    "• *Pik / Crop* – Crop health\n" +
    "• *Hava / Weather* – Farm conditions\n\n" +
    "Type *Help* to see all options. 🌾"
  );
}

// ─── Main AI Reply Generator ─────────────────────────────────────────────────

export async function generateAIReply(userMessage: string): Promise<string> {
  const intent = detectIntent(userMessage);

  logger.info({ intent, userMessage }, "WhatsApp intent detected");

  switch (intent) {
    case "greeting":
      return getGreeting();

    case "help":
      return getHelp();

    case "irrigation":
      return await getMoistureAdvice();

    case "fertilizer":
      return await getFertilizerAdvice();

    case "crop_health":
      return getCropHealthAdvice(userMessage);

    case "weather":
      return getWeatherAdvice();

    default:
      return getUnknownResponse();
  }
}
