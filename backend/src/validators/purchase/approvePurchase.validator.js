import { param } from "express-validator";

export const approvePurchaseValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Purchase ID is required."),
];