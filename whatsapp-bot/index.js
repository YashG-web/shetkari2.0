require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5007/api";

async function getLatestStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/simulator/latest`);
    if (!response.ok) throw new Error("API Offline");
    return await response.json();
  } catch (error) {
    console.error("Error fetching from API:", error);
    return null;
  }
}

// POST route for Twilio Webhook
app.post('/webhook/whatsapp', async (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase().trim();
  const twiml = new MessagingResponse();

  console.log(`Received message: ${incomingMsg}`);

  const data = await getLatestStats();
  let reply = "";

  if (!data) {
    reply = "⚠️ Error: Unable to connect to farm sensors. Please try again later.";
  } else if (incomingMsg.includes('soil')) {
    reply = `💧 Soil Moisture: ${data.soilMoisture}%\nStatus: ${data.soilMoisture < 50 ? 'Low' : 'Optimal'}`;
  } 
  else if (incomingMsg.includes('temp')) {
    reply = `🌡️ Temperature: ${data.temperature}°C\nStatus: ${data.temperature > 35 ? 'High (Heat Stress Risk)' : 'Stable'}`;
  }
  else if (incomingMsg.includes('humidity')) {
    reply = `🌬️ Humidity: ${data.humidity}%\nStatus: ${data.humidity > 80 ? 'High' : 'Normal'}`;
  }
  else if (incomingMsg.includes('predict') || incomingMsg.includes('irrigation')) {
    reply = `🧠 AI Forecast:\n${data.irrigationAdvisory}\n\nPump Status: ${data.pumpStatus}`;
  }
  else if (incomingMsg.includes('summary') || incomingMsg.includes('all')) {
    reply = `🚜 *Shetkari Farm Summary*\n` +
            `Timestamp: ${new Date(data.timestamp).toLocaleTimeString()}\n` +
            `------------------\n` +
            `💧 Moisture: ${data.soilMoisture}%\n` +
            `🌡️ Temp: ${data.temperature}°C\n` +
            `🌬️ Humidity: ${data.humidity}%\n` +
            `🌱 NPK: ${data.nitrogen}/${data.phosphorus}/${data.potassium}\n` +
            `------------------\n` +
            `✨ *AI Recommendation:*\n${data.fertilizerRecommendation}`;
  }
  else {
    reply = "Welcome to Shetkari AI Support! 🌿\n\nCommands:\n- 'soil': Check moisture\n- 'temp': Check temperature\n- 'humidity': Check humidity\n- 'predict': AI Forecast\n- 'summary': Daily Overview\n\nType any command to get started.";
  }

  twiml.message(reply);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Shetkari WhatsApp Bot listening on port ${PORT}`);
  console.log(`Local Webhook URL: http://localhost:${PORT}/webhook/whatsapp`);
});

