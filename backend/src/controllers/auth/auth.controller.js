import authService from "../../services/auth/auth.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";

import serializeAuth from "../../serializers/auth.serializer.js";
import serializeUser from "../../serializers/user.serializer.js";

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body, {
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      return ApiResponse.success(
        res,
        "User registered successfully.",
          serializeUser(user),
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body, {
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      return ApiResponse.success(
        res,
        "Login successful.",
        serializeAuth(result),
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.me(req.user._id);

      return ApiResponse.success(
        res,
        "User fetched successfully.",
        serializeUser(user)
      );
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const result = await authService.refreshToken(
        req.body.refreshToken
      );

      return ApiResponse.success(
        res,
        "Access token refreshed successfully.",
        result
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();