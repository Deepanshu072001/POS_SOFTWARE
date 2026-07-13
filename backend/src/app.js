import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

/**
 * Root Route
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    application: "CafeFlow POS Enterprise",
    version: "1.0.0",
    message: "Welcome to CafeFlow POS API",
    health: "/api/v1/health",
  });
});

/**
 * Health Route
 */
app.use("/api/v1/health", healthRoutes);

/**
 * Error Handlers
 */
app.use(notFound);
app.use(errorHandler);

export default app;