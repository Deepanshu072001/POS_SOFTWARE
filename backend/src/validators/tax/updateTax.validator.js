import { body } from "express-validator";

import STATUS from "../../constants/status.js";
import TAX_TYPES from "../../constants/taxTypes.js";

export const updateTaxValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Tax name cannot exceed 100 characters."),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Tax code cannot exceed 20 characters."),

  body("type")
    .optional()
    .isIn(Object.values(TAX_TYPES))
    .withMessage("Invalid tax type."),

  body("rate")
    .optional()
    .isNumeric()
    .withMessage("Tax rate must be numeric."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be true or false."),

  body("status")
    .optional()
    .isIn(Object.values(STATUS))
    .withMessage("Invalid status."),
];