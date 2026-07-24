import { body } from "express-validator";

import PURCHASE_TYPES from "../../constants/purchaseTypes.js";

export const updatePurchaseValidator = [
  body("supplier").optional().trim(),

  body("branch").optional().trim(),

  body("invoiceDate")
    .optional()
    .isISO8601(),

  body("purchaseDate")
    .optional()
    .isISO8601(),

  body("invoiceNumber")
    .optional()
    .trim(),

  body("purchaseType")
    .optional()
    .isIn(Object.values(PURCHASE_TYPES)),

  body("shippingCharge")
    .optional()
    .isFloat({ min: 0 }),

  body("roundOff")
    .optional()
    .isFloat(),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 }),

  body("items")
    .optional()
    .isArray({ min: 1 }),

  body("items.*.variant")
    .optional()
    .trim(),

  body("items.*.quantity")
    .optional()
    .isFloat({ min: 0.01 }),

  body("items.*.freeQuantity")
    .optional()
    .isFloat({ min: 0 }),

  body("items.*.unitCost")
    .optional()
    .isFloat({ min: 0 }),

  body("items.*.discountPercentage")
    .optional()
    .isFloat({ min: 0 }),

  body("items.*.discountAmount")
    .optional()
    .isFloat({ min: 0 }),

  body("items.*.taxPercentage")
    .optional()
    .isFloat({ min: 0 }),

  body("items.*.taxAmount")
    .optional()
    .isFloat({ min: 0 }),

  body("items.*.remarks")
    .optional()
    .trim()
    .isLength({ max: 500 }),
];