import serializeUser from "./user.serializer.js";

const serializeAuth = ({
  user,
  accessToken,
  refreshToken = null,
}) => {
  return {
    user: serializeUser(user),
    accessToken,
    refreshToken,
  };
};

export default serializeAuth;