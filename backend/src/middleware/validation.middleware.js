import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/apiResponse.js";

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return ApiResponse.error(
      res,
      "Validation failed",
      errors.array(),
      400
    );
  }

  next();
};

export default validationMiddleware;