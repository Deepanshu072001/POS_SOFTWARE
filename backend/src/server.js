import dotenv from "dotenv";
dotenv.config();
import "./config/env.js";

import http from "http";
import app from "./app.js";
import connectDatabase from "./config/database.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      logger.error(error.message);
      process.exit(1);
    });
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

startServer();