# Shetkari WhatsApp Chatbot Demo

A lightweight Node.js + Express backend to demonstrate a WhatsApp chatbot for the Shetkari smart agriculture project using the Twilio WhatsApp Sandbox.

## Prerequisites
- **Node.js**: Installed on your machine.
- **Twilio Account**: A free account at [twilio.com](https://www.twilio.com).
- **ngrok**: To expose your local server to the internet ([ngrok.com](https://ngrok.com)).

## Folder Structure
```
whatsapp-bot/
├── index.js        # Main logic and webhook route
├── package.json    # Project dependencies
├── .env.example    # Environment variable template
└── README.md       # Detailed instructions
```

## Installation
Navigate to the `whatsapp-bot` folder and install dependencies:
```bash
cd whatsapp-bot
npm install
```

## Running Locally
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Start the server:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`.

## Connecting to Twilio WhatsApp Sandbox
1. Go to the **Twilio Console** > **Messaging** > **Try it Out** > **Send a WhatsApp Message**.
2. Follow the instructions to join the sandbox (usually by sending a code like `join <word>` to a specific number).
3. In the **Sandbox Settings**, find the "When a message comes in" field.
4. Open a new terminal and start `ngrok`:
   ```bash
   ngrok http 3000
   ```
5. Copy the **Forwarding URL** provided by ngrok (e.g., `https://a1b2c3d4.ngrok.io`).
6. Paste it into the Twilio Sandbox settings with the webhook path appended:
   `https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp`
7. Click **Save**.

## Testing Commands
Send these messages to the Twilio Sandbox number:
- `soil`: Returns moisture data.
- `temp`: Returns temperature data.
- `humidity`: Returns humidity data.
- `predict`: Returns AI prediction.
- `summary`: Returns farm summary.
- `help`: Returns list of commands.

## Future Integration
The `index.js` file contains comments marked with `REAL INTEGRATION`. These are the spots where you can later:
- Fetch real data from your ESP32 through your API server.
- Call your Python ML service for real-time predictions.
