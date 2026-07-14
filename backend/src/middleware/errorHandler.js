import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode;

  if (!statusCode || statusCode === 200) {
    statusCode = 500;
  }

  let message = err.message || "Internal Server Error";

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists`;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;

    message = "Invalid resource ID";
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};

export default errorHandler;