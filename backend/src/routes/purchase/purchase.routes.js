import { Router } from "express";

import purchaseController from "../../controllers/purchase/purchase.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import permissionMiddleware from "../../middleware/permission.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

import {
  createPurchaseValidator,
} from "../../validators/purchase/createPurchase.validator.js";

import {
  updatePurchaseValidator,
} from "../../validators/purchase/updatePurchase.validator.js";

import {
  approvePurchaseValidator,
} from "../../validators/purchase/approvePurchase.validator.js";

import {
  receivePurchaseValidator,
} from "../../validators/purchase/receivePurchase.validator.js";

import {
  cancelPurchaseValidator,
} from "../../validators/purchase/cancelPurchase.validator.js";

import PERMISSIONS from "../../constants/permission.constants.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Purchase CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.PURCHASE_CREATE),
  createPurchaseValidator,
  validationMiddleware,
  purchaseController.create
);

router.get(
  "/",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.PURCHASE_VIEW),
  purchaseController.findAll
);

router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.PURCHASE_VIEW),
  purchaseController.findById
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.PURCHASE_UPDATE),
  updatePurchaseValidator,
  validationMiddleware,
  purchaseController.update
);

router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.PURCHASE_DELETE),
  purchaseController.delete
);

/*
|--------------------------------------------------------------------------
| Workflow
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/approve",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.PURCHASE_APPROVE),
  approvePurchaseValidator,
  validationMiddleware,
  purchaseController.approve
);

router.patch(
  "/:id/receive",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.PURCHASE_RECEIVE),
  receivePurchaseValidator,
  validationMiddleware,
  purchaseController.receive
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.PURCHASE_CANCEL),
  cancelPurchaseValidator,
  validationMiddleware,
  purchaseController.cancel
);

export default router;