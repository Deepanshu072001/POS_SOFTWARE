import { body } from "express-validator";

import STATUS from "../../constants/status.js";

export const createVariantValidator = [
  body("product")
    .notEmpty()
    .withMessage("Product is required.")
    .isMongoId()
    .withMessage("Invalid product."),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Variant name is required.")
    .isLength({ max: 100 })
    .withMessage("Variant name cannot exceed 100 characters."),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 50 }),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required.")
    .isLength({ max: 100 }),

  body("barcode")
    .optional({ nullable: true })
    .trim(),

  body("sellingPrice")
    .notEmpty()
    .withMessage("Selling price is required.")
    .isFloat({ min: 0 })
    .withMessage("Selling price must be greater than or equal to 0."),

  body("costPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cost price must be greater than or equal to 0."),

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