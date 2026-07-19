import { body } from "express-validator";
import STATUS from "../../constants/status.js";

export const createUnitValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Unit name is required.")
    .isLength({ max: 100 })
    .withMessage("Unit name cannot exceed 100 characters."),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Unit code cannot exceed 20 characters."),

  body("symbol")
    .trim()
    .notEmpty()
    .withMessage("Unit symbol is required.")
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