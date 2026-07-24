import { param } from "express-validator";

export const receivePurchaseValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Purchase ID is required."),
];