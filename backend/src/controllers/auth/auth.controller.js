import authService from "../../services/auth/auth.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";

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
        user,
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
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();