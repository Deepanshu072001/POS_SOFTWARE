import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth/auth.routes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import testRoutes from "./routes/test.routes.js";

import branchRoutes from "./routes/branch/branch.routes.js";
import categoryRoutes from "./routes/category/category.routes.js";

import unitRoutes from "./routes/unit/unit.routes.js";
import taxRoutes from "./routes/tax/tax.routes.js";



const app = express();

const API_PREFIX = "/api/v1";

// Security
app.disable("x-powered-by");
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Compression
app.use(compression());

// Body Parsers
app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Cookies
app.use(cookieParser());

// HTTP Logger
app.use(morgan("dev"));

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    application: "CafeFlow POS Enterprise",
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    message: "Welcome to CafeFlow POS API",
    health: `${API_PREFIX}/health`,
  });
});

// API Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/health`, healthRoutes);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/branches", branchRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/units", unitRoutes);
app.use("/api/v1/taxes", taxRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;