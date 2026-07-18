import { Router } from "express";

import authController from "../../controllers/auth/auth.controller.js";

import { registerValidator } from "../../validators/auth/register.validator.js";
import { loginValidator } from "../../validators/auth/login.validator.js";
import { refreshTokenValidator } from "../../validators/auth/refresh.validator.js";

import validationMiddleware from "../../middleware/validation.middleware.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  registerValidator,
  validationMiddleware,
  authController.register
);

router.post(
  "/login",
  loginValidator,
  validationMiddleware,
  authController.login
);

router.get(
  "/me",
  authMiddleware,
  authController.me
);

router.post(
  "/refresh",
  refreshTokenValidator,
  validationMiddleware,
  authController.refreshToken
);

export default router;