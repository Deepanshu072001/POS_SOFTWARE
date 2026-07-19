import { body } from "express-validator";
import STATUS from "../../constants/status.js";

export const updateUnitValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Unit name cannot exceed 100 characters."),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Unit code cannot exceed 20 characters."),

  body("symbol")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Unit symbol cannot exceed 20 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("status")
    .optional()
    .isIn(Object.values(STATUS))
    .withMessage("Invalid status."),
];