import AppError from "../utils/AppError.js";

const authorizePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError("Authentication required.", 401);
      }

      const roleName = req.user.role?.name || "NO ROLE";

      const userPermissions =
        req.user.role?.permissions?.map(
          (permission) => permission.name
        ) || [];

      // ===== DEBUG =====
      console.log("==================================");
      console.log("ROLE:", roleName);
      console.log("USER PERMISSIONS:", userPermissions);
      console.log("REQUIRED PERMISSIONS:", requiredPermissions);
      console.log("==================================");
      // =================

      const hasPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
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

export default authorizePermission;