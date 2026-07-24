import { body } from "express-validator";

import STATUS from "../../constants/status.js";

export const updateVariantValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 50 }),

  body("sku")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("barcode")
    .optional({ nullable: true })
    .trim(),

  body("sellingPrice")
    .optional()
    .isFloat({ min: 0 }),

  body("costPrice")
    .optional()
    .isFloat({ min: 0 }),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 }),

  body("isDefault")
    .optional()
    .isBoolean(),

  body("status")
    .optional()
    .isIn(Object.values(STATUS)),
];