import { Router, type IRouter } from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/growth-stage", upload.single("image"), async (req, res) => {
  logger.info("Received growth stage analysis request");

  if (!req.file) {
    logger.warn("No image file provided in request");
    res.status(400).json({ error: "No image file provided" });
    return;
  }

  try {
    logger.info({ 
      filename: req.file.originalname, 
      mimetype: req.file.mimetype,
      size: req.file.size
    }, "Preparing image for ML inference");

    // Create FormData specifically for Node.js using form-data package
    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    logger.debug(`Forwarding request to ML Service: ${ML_SERVICE_URL}/predict/growth-stage`);

    // Forward to ML Service
    const response = await axios.post(`${ML_SERVICE_URL}/predict/growth-stage`, form, {
      headers: {
        ...form.getHeaders()
      },
      timeout: 10000 // 10s timeout for image processing
    });

    logger.info("ML Inference successful");
    res.json(response.data);
  } catch (error: any) {
    logger.error({ 
      err: error.message,
      stack: error.stack,
      response: error.response?.data
    }, "Growth Stage Inference Error");

    const statusCode = error.response?.status || 500;
    const detail = error.response?.data?.detail || error.message;
    
    res.status(statusCode).json({ 
      error: "ML Inference Failed", 
      details: detail 
    });
  }
});

export default router;
