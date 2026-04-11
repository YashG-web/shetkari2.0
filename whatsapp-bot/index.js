require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Dummy data for the demo
const FARM_DATA = {
  soil: "Soil moisture: 24%\nStatus: Slightly Low",
  temp: "Temperature: 31°C\nStatus: Warm",
  humidity: "Humidity: 68%\nStatus: Optimal",
  predict: "Prediction: Irrigation may be needed tomorrow based on rapid moisture depletion.",
  summary: "Farm conditions are stable today. Temperature is slightly high but soil moisture is within acceptable limits for the next 24 hours.",
  help: "Welcome to Shetkari AI Support!\nCommands:\n- 'soil': Check moisture\n- 'temp': Check temperature\n- 'humidity': Check humidity\n- 'predict': AI Forecast\n- 'summary': Daily Overview\n\nContact support: +91 XXXXX XXXXX"
};

// POST route for Twilio Webhook
app.post('/webhook/whatsapp', (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase().trim();
  const twiml = new MessagingResponse();

  console.log(`Received message: ${incomingMsg}`);

  let reply = "";

  // Handle commands
  if (incomingMsg.includes('soil')) {
    // REAL INTEGRATION: Fetch from ESP32 or shared-state API
    // Example: const data = await fetch('http://localhost:5007/api/sensors');
    reply = FARM_DATA.soil;
  } 
  else if (incomingMsg.includes('temp')) {
    reply = FARM_DATA.temp;
  }
  else if (incomingMsg.includes('humidity')) {
    reply = FARM_DATA.humidity;
  }
  else if (incomingMsg.includes('predict')) {
    // REAL INTEGRATION: Call ML service/predict endpoint
    reply = FARM_DATA.predict;
  }
  else if (incomingMsg.includes('summary')) {
    reply = FARM_DATA.summary;
  }
  else {
    // Default to help message
    reply = FARM_DATA.help;
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
