import { body } from "express-validator";

import STATUS from "../../constants/status.js";
import FOOD_TYPES from "../../constants/foodTypes.js";
import PRODUCT_TYPES from "../../constants/productTypes.js";

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Product name cannot exceed 150 characters."),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Product code cannot exceed 50 characters."),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category."),

  body("unit")
    .optional()
    .isMongoId()
    .withMessage("Invalid unit."),

  body("tax")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid tax."),

  body("foodType")
    .optional()
    .isIn(Object.values(FOOD_TYPES))
    .withMessage("Invalid food type."),

  body("productType")
    .optional()
    .isIn(Object.values(PRODUCT_TYPES))
    .withMessage("Invalid product type."),

  body("branches")
    .optional()
    .isArray()
    .withMessage("Branches must be an array."),

  body("branches.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid branch."),

  body("shortDescription")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Short description cannot exceed 300 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters."),

  body("preparationTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Preparation time must be zero or greater."),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be zero or greater."),

  body("trackInventory")
    .optional()
    .isBoolean()
    .withMessage("trackInventory must be true or false."),

  body("allowNegativeStock")
    .optional()
    .isBoolean()
    .withMessage("allowNegativeStock must be true or false."),

  body("hasVariants")
    .optional()
    .isBoolean()
    .withMessage("hasVariants must be true or false."),

  body("hasAddons")
    .optional()
    .isBoolean()
    .withMessage("hasAddons must be true or false."),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be true or false."),

  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable must be true or false."),

  body("status")
    .optional()
    .isIn(Object.values(STATUS))
    .withMessage("Invalid status."),
];