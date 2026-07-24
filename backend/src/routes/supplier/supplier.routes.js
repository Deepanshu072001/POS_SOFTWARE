import { Router } from "express";

import SupplierController from "../../controllers/supplier/supplier.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizePermission from "../../middleware/permission.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

import {
  createSupplierValidator,
} from "../../validators/supplier/createSupplier.validator.js";

import {
  updateSupplierValidator,
} from "../../validators/supplier/updateSupplier.validator.js";

import {
  changeSupplierStatusValidator,
} from "../../validators/supplier/changeSupplierStatus.validator.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizePermission("SUPPLIER.CREATE"),
  createSupplierValidator,
  validationMiddleware,
  SupplierController.create
);

router.get(
  "/",
  authMiddleware,
  authorizePermission("SUPPLIER.READ"),
  SupplierController.findAll
);

router.get(
  "/:id",
  authMiddleware,
  authorizePermission("SUPPLIER.READ"),
  SupplierController.findById
);

router.put(
  "/:id",
  authMiddleware,
  authorizePermission("SUPPLIER.UPDATE"),
  updateSupplierValidator,
  validationMiddleware,
  SupplierController.update
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizePermission("SUPPLIER.UPDATE"),
  changeSupplierStatusValidator,
  validationMiddleware,
  SupplierController.changeStatus
);

router.delete(
  "/:id",
  authMiddleware,
  authorizePermission("SUPPLIER.DELETE"),
  SupplierController.delete
);

export default router;