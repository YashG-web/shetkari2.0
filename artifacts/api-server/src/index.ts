import app from "./app";
import { logger } from "./lib/logger";
import fs from "fs";
import path from "path";

// Manual .env loader
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach((line) => {
      const [key, ...value] = line.split("=");
      if (key && value) {
        process.env[key.trim()] = value.join("=").trim().replace(/^['"]|['"]$/g, "");
      }
    });
    logger.info("📡 Loaded environment variables from .env");
  }
} catch (err) {
  logger.warn("⚠️ Failed to load .env file manually");
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
