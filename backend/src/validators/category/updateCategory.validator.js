import { body } from "express-validator";

import STATUS from "../../constants/status.js";

export const updateCategoryValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Category name cannot exceed 100 characters."),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Category code cannot exceed 20 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("image")
    .optional()
    .trim(),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a positive number."),

  body("status")
    .optional()
    .isIn(Object.values(STATUS))
    .withMessage("Invalid category status."),
];