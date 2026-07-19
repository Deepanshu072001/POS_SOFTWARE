import { body, param } from "express-validator";

export const updateBranchValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid branch id"),

  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Branch name cannot exceed 100 characters"),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Branch code cannot exceed 10 characters"),

  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),

  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number"),
];