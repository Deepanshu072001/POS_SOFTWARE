import { Router } from "express";

import unitController from "../../controllers/unit/unit.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizePermission from "../../middleware/permission.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

import {
  createUnitValidator,
} from "../../validators/unit/createUnit.validator.js";

import {
  updateUnitValidator,
} from "../../validators/unit/updateUnit.validator.js";

import {
  changeStatusValidator,
} from "../../validators/unit/changeStatus.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Unit Routes
|--------------------------------------------------------------------------
*/

// Create
router.post(
  "/",
  authMiddleware,
  authorizePermission("UNIT.CREATE"),
  createUnitValidator,
  validationMiddleware,
  unitController.create
);

// List
router.get(
  "/",
  authMiddleware,
  authorizePermission("UNIT.READ"),
  unitController.findAll
);

// Details
router.get(
  "/:id",
  authMiddleware,
  authorizePermission("UNIT.READ"),
  unitController.findById
);

// Update
router.put(
  "/:id",
  authMiddleware,
  authorizePermission("UNIT.UPDATE"),
  updateUnitValidator,
  validationMiddleware,
  unitController.update
);

// Change Status
router.patch(
  "/:id/status",
  authMiddleware,
  authorizePermission("UNIT.UPDATE"),
  changeStatusValidator,
  validationMiddleware,
  unitController.changeStatus
);

// Delete
router.delete(
  "/:id",
  authMiddleware,
  authorizePermission("UNIT.DELETE"),
  unitController.delete
);

export default router;