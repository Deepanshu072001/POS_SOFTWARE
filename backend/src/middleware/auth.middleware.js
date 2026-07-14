import userRepository from "../repositories/auth/user.repository.js";

import { verifyAccessToken } from "../utils/jwt.js";

import STATUS from "../constants/status.js";

import AppError from "../utils/AppError.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization header is missing.", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError("Invalid authorization format.", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Access token is missing.", 401);
    }

    // Verify JWT
    const decoded = verifyAccessToken(token);

    // Find User
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError("User not found.", 401);
    }

    // Soft deleted account
    if (user.isDeleted) {
      throw new AppError("User account has been deleted.", 401);
    }

    // Inactive account
    if (user.status !== STATUS.ACTIVE) {
      throw new AppError("User account is inactive.", 403);
    }

    // Locked account
    if (user.isLocked) {
      throw new AppError(
        "Your account is temporarily locked.",
        423
      );
    }

    // Attach authenticated user
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;