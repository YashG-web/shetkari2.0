import { Router, type IRouter, type Request, type Response } from "express";
import { logger } from "../lib/logger";
import { sendWhatsAppMessage, generateAIReply } from "../services/whatsapp-service";

const router: IRouter = Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "shetkari_verify_token";

// ─── GET /webhook/whatsapp ────────────────────────────────────────────────────
// Meta calls this endpoint to verify the webhook during setup.

router.get("/webhook/whatsapp", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  logger.info({ mode, token }, "WhatsApp webhook verification request received");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    logger.info("WhatsApp webhook verified successfully");
    res.status(200).send(challenge as string);
  } else {
    logger.warn({ mode, token }, "WhatsApp webhook verification failed - invalid token");
    res.status(403).json({ error: "Verification failed" });
  }
});

// ─── POST /webhook/whatsapp ───────────────────────────────────────────────────
// Meta sends all incoming WhatsApp messages here.

router.post("/webhook/whatsapp", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Acknowledge receipt immediately (required by Meta within 20 seconds)
    res.status(200).send("OK");

    if (body?.object !== "whatsapp_business_account") return;

    const entries = body?.entry ?? [];

    for (const entry of entries) {
      const changes = entry?.changes ?? [];

      for (const change of changes) {
        const value = change?.value;
        if (!value) continue;

        const messages = value?.messages ?? [];

        for (const message of messages) {
          if (message.type !== "text") {
            // Handle non-text (image, audio etc.) gracefully
            logger.info({ type: message.type }, "Non-text WhatsApp message received, skipping AI reply");
            continue;
          }

          const from: string = message.from;
          const userText: string = message?.text?.body ?? "";
          const messageId: string = message.id;

          logger.info({ from, messageId, userText }, "Incoming WhatsApp message");

          // Generate AI-powered or rule-based reply
          const reply = await generateAIReply(userText);

          // Send the reply back
          await sendWhatsAppMessage(from, reply);

          logger.info({ from, reply }, "WhatsApp reply dispatched");
        }
      }
    }
  } catch (err: any) {
    logger.error({ err: err?.message }, "Error processing WhatsApp webhook");
    // Response already sent, can't send again
  }
});

export default router;
