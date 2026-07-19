import { Router } from "express";

import categoryController from "../../controllers/category/category.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizePermission from "../../middleware/permission.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

import {
  createCategoryValidator,
} from "../../validators/category/createCategory.validator.js";

import {
  updateCategoryValidator,
} from "../../validators/category/updateCategory.validator.js";

import {
  changeStatusValidator,
} from "../../validators/category/changeStatus.validator.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizePermission("CATEGORY.CREATE"),
  createCategoryValidator,
  validationMiddleware,
  categoryController.create
);

router.get(
  "/",
  authMiddleware,
  authorizePermission("CATEGORY.READ"),
  categoryController.findAll
);

router.get(
  "/:id",
  authMiddleware,
  authorizePermission("CATEGORY.READ"),
  categoryController.findById
);

router.put(
  "/:id",
  authMiddleware,
  authorizePermission("CATEGORY.UPDATE"),
  updateCategoryValidator,
  validationMiddleware,
  categoryController.update
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizePermission("CATEGORY.UPDATE"),
  changeStatusValidator,
  validationMiddleware,
  categoryController.changeStatus
);

router.delete(
  "/:id",
  authMiddleware,
  authorizePermission("CATEGORY.DELETE"),
  categoryController.delete
);

export default router;