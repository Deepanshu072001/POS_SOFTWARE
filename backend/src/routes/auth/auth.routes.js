import { Router } from "express";

import authController from "../../controllers/auth/auth.controller.js";

import { registerValidator } from "../../validators/auth/register.validator.js";

import validationMiddleware from "../../middleware/validation.middleware.js";

const router = Router();

router.post(
  "/register",
  registerValidator,
  validationMiddleware,
  authController.register
);

export default router;