import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    logger.error(err.stack);

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack:
            process.env.NODE_ENV === "development"
                ? err.stack
                : undefined,
    });
};

export default errorHandler;