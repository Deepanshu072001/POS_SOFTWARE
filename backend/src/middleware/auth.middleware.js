import userRepository from "../repositories/auth/user.repository.js";
import { verifyAccessToken } from "../utils/jwt.js";
import STATUS from "../constants/status.js";
import AppError from "../utils/AppError.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization header is missing.", 401);
    }

    // Validate Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError("Invalid authorization format.", 401);
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Access token is missing.", 401);
    }

    // Verify JWT
    const decoded = verifyAccessToken(token);

    // Load authenticated user
    // IMPORTANT:
    // findById() must populate:
    // role -> permissions
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError("User not found.", 401);
    }

    if (user.isDeleted) {
      throw new AppError("User account has been deleted.", 401);
    }

    if (user.status !== STATUS.ACTIVE) {
      throw new AppError("User account is inactive.", 403);
    }

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