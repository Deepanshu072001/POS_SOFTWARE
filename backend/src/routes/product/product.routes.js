import { Router } from "express";

import productController from "../../controllers/product/product.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizePermission from "../../middleware/permission.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

import {
  createProductValidator,
} from "../../validators/product/createProduct.validator.js";

import {
  updateProductValidator,
} from "../../validators/product/updateProduct.validator.js";

import {
  changeStatusValidator,
} from "../../validators/product/changeStatus.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Product Routes
|--------------------------------------------------------------------------
*/

// Create Product
router.post(
  "/",
  authMiddleware,
  authorizePermission("PRODUCT.CREATE"),
  createProductValidator,
  validationMiddleware,
  productController.create
);

// Get Products
router.get(
  "/",
  authMiddleware,
  authorizePermission("PRODUCT.READ"),
  productController.findAll
);

// Get Product By ID
router.get(
  "/:id",
  authMiddleware,
  authorizePermission("PRODUCT.READ"),
  productController.findById
);

// Update Product
router.put(
  "/:id",
  authMiddleware,
  authorizePermission("PRODUCT.UPDATE"),
  updateProductValidator,
  validationMiddleware,
  productController.update
);

// Change Status
router.patch(
  "/:id/status",
  authMiddleware,
  authorizePermission("PRODUCT.UPDATE"),
  changeStatusValidator,
  validationMiddleware,
  productController.changeStatus
);

// Delete Product
router.delete(
  "/:id",
  authMiddleware,
  authorizePermission("PRODUCT.DELETE"),
  productController.delete
);

export default router;