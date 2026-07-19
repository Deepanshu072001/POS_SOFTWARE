import { Router } from "express";

import branchController from "../../controllers/branch/branch.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizePermission from "../../middleware/permission.middleware.js";

import validationMiddleware from "../../middleware/validation.middleware.js";

import {
  createBranchValidator,
} from "../../validators/branch/createBranch.validator.js";

import {
  updateBranchValidator,
} from "../../validators/branch/updateBranch.validator.js";

import {
  changeStatusValidator,
} from "../../validators/branch/changeStatus.validator.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizePermission("BRANCH.CREATE"),
  createBranchValidator,
  validationMiddleware,
  branchController.create
);

router.get(
  "/",
  authMiddleware,
  authorizePermission("BRANCH.READ"),
  branchController.findAll
);

router.get(
  "/:id",
  authMiddleware,
  authorizePermission("BRANCH.READ"),
  branchController.findById
);

router.put(
  "/:id",
  authMiddleware,
  authorizePermission("BRANCH.UPDATE"),
  updateBranchValidator,
  validationMiddleware,
  branchController.update
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizePermission("BRANCH.UPDATE"),
  changeStatusValidator,
  validationMiddleware,
  branchController.changeStatus
);

router.delete(
  "/:id",
  authMiddleware,
  authorizePermission("BRANCH.DELETE"),
  branchController.delete
);

export default router;