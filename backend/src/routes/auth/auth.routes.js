import { Router } from "express";

import authController from "../../controllers/auth/auth.controller.js";

import {
  registerValidator,
} from "../../validators/auth/register.validator.js";

import {
  loginValidator,
} from "../../validators/auth/login.validator.js";

import validationMiddleware from "../../middleware/validation.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// Register
router.post(
  "/register",
  registerValidator,
  validationMiddleware,
  authController.register
);

// Login
router.post(
  "/login",
  loginValidator,
  validationMiddleware,
  authController.login
);

export default router;