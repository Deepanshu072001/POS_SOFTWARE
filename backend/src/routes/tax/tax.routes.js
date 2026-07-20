import { Router } from "express";

import taxController from "../../controllers/tax/tax.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizePermission from "../../middleware/permission.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

import {
  createTaxValidator,
} from "../../validators/tax/createTax.validator.js";

import {
  updateTaxValidator,
} from "../../validators/tax/updateTax.validator.js";

import {
  changeStatusValidator,
} from "../../validators/tax/changeStatus.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Tax Routes
|--------------------------------------------------------------------------
*/

// Create
router.post(
  "/",
  authMiddleware,
  authorizePermission("TAX.CREATE"),
  createTaxValidator,
  validationMiddleware,
  taxController.create
);

// List
router.get(
  "/",
  authMiddleware,
  authorizePermission("TAX.READ"),
  taxController.findAll
);

// Details
router.get(
  "/:id",
  authMiddleware,
  authorizePermission("TAX.READ"),
  taxController.findById
);

// Update
router.put(
  "/:id",
  authMiddleware,
  authorizePermission("TAX.UPDATE"),
  updateTaxValidator,
  validationMiddleware,
  taxController.update
);

// Change Status
router.patch(
  "/:id/status",
  authMiddleware,
  authorizePermission("TAX.UPDATE"),
  changeStatusValidator,
  validationMiddleware,
  taxController.changeStatus
);

// Delete
router.delete(
  "/:id",
  authMiddleware,
  authorizePermission("TAX.DELETE"),
  taxController.delete
);

export default router;