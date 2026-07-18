import AppError from "../utils/AppError.js";

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError("Authentication required.", 401);
      }

      const userRole = req.user.role?.name;

      if (!userRole) {
        throw new AppError("User role not found.", 403);
      }

      if (!allowedRoles.includes(userRole)) {
        throw new AppError(
          "You do not have permission to perform this action.",
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorizeRole;