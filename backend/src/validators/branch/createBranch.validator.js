import { body } from "express-validator";

export const createBranchValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Branch name is required")
    .isLength({ max: 100 })
    .withMessage("Branch name cannot exceed 100 characters"),

  body("code")
    .trim()
    .notEmpty()
    .withMessage("Branch code is required")
    .isLength({ max: 10 })
    .withMessage("Branch code cannot exceed 10 characters"),

  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email address"),

  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number"),

  body("address.city")
    .notEmpty()
    .withMessage("City is required"),

  body("address.state")
    .notEmpty()
    .withMessage("State is required"),

  body("address.pincode")
    .notEmpty()
    .withMessage("Pincode is required"),
];