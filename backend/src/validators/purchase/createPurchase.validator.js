import { body } from "express-validator";

import PURCHASE_TYPES from "../../constants/purchaseTypes.js";

export const createPurchaseValidator = [
  body("supplier")
    .trim()
    .notEmpty()
    .withMessage("Supplier is required."),

  body("branch")
    .trim()
    .notEmpty()
    .withMessage("Branch is required."),

  body("invoiceDate")
    .notEmpty()
    .withMessage("Invoice date is required.")
    .isISO8601(),

  body("purchaseDate")
    .optional()
    .isISO8601(),

  body("invoiceNumber")
    .optional()
    .trim()
    .isLength({ max: 100 }),

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
    .isArray({ min: 1 })
    .withMessage("At least one item is required."),

  body("items.*.variant")
    .trim()
    .notEmpty()
    .withMessage("Variant is required."),

  body("items.*.quantity")
    .isFloat({ min: 0.01 })
    .withMessage("Quantity must be greater than zero."),

  body("items.*.freeQuantity")
    .optional()
    .isFloat({ min: 0 }),

  body("items.*.unitCost")
    .isFloat({ min: 0 })
    .withMessage("Unit cost is required."),

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