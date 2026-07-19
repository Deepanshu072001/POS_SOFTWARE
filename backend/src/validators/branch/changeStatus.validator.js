import { body, param } from "express-validator";

import STATUS from "../../constants/status.js";

export const changeStatusValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid branch id"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(Object.values(STATUS))
    .withMessage("Invalid status"),
];