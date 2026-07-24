import { Router } from "express";

import variantController from "../../controllers/product/variant.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizePermission from "../../middleware/permission.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

import {
  createVariantValidator,
} from "../../validators/product/createVariant.validator.js";

import {
  updateVariantValidator,
} from "../../validators/product/updateVariant.validator.js";

import {
  changeVariantStatusValidator,
} from "../../validators/product/changeVariantStatus.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Variant Routes
|--------------------------------------------------------------------------
*/

// Create Variant
router.post(
  "/",
  authMiddleware,
  authorizePermission("PRODUCT.UPDATE"),
  createVariantValidator,
  validationMiddleware,
  variantController.create
);

// Get Variants By Product
router.get(
  "/product/:productId",
  authMiddleware,
  authorizePermission("PRODUCT.READ"),
  variantController.findAll
);

// Get Variant
router.get(
  "/:id",
  authMiddleware,
  authorizePermission("PRODUCT.READ"),
  variantController.findById
);

// Update Variant
router.put(
  "/:id",
  authMiddleware,
  authorizePermission("PRODUCT.UPDATE"),
  updateVariantValidator,
  validationMiddleware,
  variantController.update
);

// Change Status
router.patch(
  "/:id/status",
  authMiddleware,
  authorizePermission("PRODUCT.UPDATE"),
  changeVariantStatusValidator,
  validationMiddleware,
  variantController.changeStatus
);

// Delete Variant
router.delete(
  "/:id",
  authMiddleware,
  authorizePermission("PRODUCT.DELETE"),
  variantController.delete
);

export default router;