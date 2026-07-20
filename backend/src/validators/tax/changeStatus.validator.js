import { body } from "express-validator";

import STATUS from "../../constants/status.js";

export const changeStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(Object.values(STATUS))
    .withMessage("Invalid status."),
];