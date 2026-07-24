import { param } from "express-validator";

export const cancelPurchaseValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Purchase ID is required."),
];