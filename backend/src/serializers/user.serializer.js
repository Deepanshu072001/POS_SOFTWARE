import serializeRole from "./role.serializer.js";

const serializeUser = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    branch: user.branch,
    role: serializeRole(user.role),
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    lastLogin: user.lastLogin,
  };
};

export default serializeUser;