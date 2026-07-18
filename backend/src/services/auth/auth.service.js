import userRepository from "../../repositories/auth/user.repository.js";
import roleRepository from "../../repositories/auth/role.repository.js";
import refreshTokenRepository from "../../repositories/auth/refreshToken.repository.js";

import auditService from "../audit/audit.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

import ROLES from "../../constants/roles.js";
import STATUS from "../../constants/status.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";

import AppError from "../../utils/AppError.js";

class AuthService {
  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  async register(userData, requestInfo = {}) {
    const existingUser = await userRepository.exists(userData.email);

    if (existingUser) {
      throw new AppError("Email already exists.", 409);
    }

    const role = await roleRepository.findByName(ROLES.CASHIER);

    if (!role) {
      throw new AppError(
        "Default role not found. Please run role seeder.",
        500
      );
    }

    const userId = await generateBusinessId("USER", "USR");

    const user = await userRepository.create({
      userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: role._id,
    });

    await auditService.log({
    user: user._id,
    module: MODULES.AUTH,
    action: AUDIT_ACTIONS.REGISTER,
    description: `User ${user.userId} registered successfully.`,
    ipAddress: requestInfo.ipAddress || "",
    userAgent: requestInfo.userAgent || "",
});

    return await userRepository.findById(user._id);
  }

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  async login(credentials, requestInfo = {}) {
    const { email, password } = credentials;

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
      throw new AppError("Invalid email or password.", 401);
    }

    if (user.status !== STATUS.ACTIVE) {
      throw new AppError(
        "Your account is inactive. Please contact the administrator.",
        403
      );
    }

    if (user.isDeleted) {
      throw new AppError("Account not found.", 404);
    }

    if (user.isLocked) {
      throw new AppError(
        "Your account is temporarily locked.",
        423
      );
    }

    const payload = {
      id: user._id,
      userId: user.userId,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    await refreshTokenRepository.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
      deviceInfo: requestInfo.userAgent || "",
      ipAddress: requestInfo.ipAddress || "",
    });

    await userRepository.update(user._id, {
      lastLogin: new Date(),
      loginAttempts: 0,
      lockUntil: null,
    });

    await auditService.log({
    user: user._id,
    module: MODULES.AUTH,
    action: AUDIT_ACTIONS.LOGIN,
    description: `User ${user.userId} logged in successfully.`,
    ipAddress: requestInfo.ipAddress || "",
    userAgent: requestInfo.userAgent || "",
});

    return {
      user: await userRepository.findById(user._id),
      accessToken,
      refreshToken,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Current User
  |--------------------------------------------------------------------------
  */

  async me(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (user.isDeleted) {
      throw new AppError("User account has been deleted.", 404);
    }

    if (user.status !== STATUS.ACTIVE) {
      throw new AppError("User account is inactive.", 403);
    }

    return user;
  }

  /*
  |--------------------------------------------------------------------------
  | Refresh Access Token
  |--------------------------------------------------------------------------
  */

  async refreshToken(refreshToken) {
    const storedToken = await refreshTokenRepository.find(refreshToken);

    if (!storedToken) {
      throw new AppError("Invalid refresh token.", 401);
    }

    if (storedToken.expiresAt < new Date()) {
      throw new AppError("Refresh token has expired.", 401);
    }

    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError("Invalid refresh token.", 401);
    }

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (user.isDeleted) {
      throw new AppError("User account has been deleted.", 404);
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

    const payload = {
      id: user._id,
      userId: user.userId,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = generateAccessToken(payload);

    await auditService.log({
  user: user._id,
  module: MODULES.AUTH,
  action: AUDIT_ACTIONS.REFRESH_TOKEN,
  description: `Access token refreshed for ${user.userId}.`,
  ipAddress: "",
  userAgent: "",
});

    return {
      accessToken,
    };
  }

  /*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

async logout(refreshToken, requestInfo = {}) {
  const storedToken =
    await refreshTokenRepository.findActiveToken(
      refreshToken
    );

  if (!storedToken) {
    throw new AppError(
      "Invalid refresh token.",
      401
    );
  }

  await refreshTokenRepository.revoke(
    refreshToken
  );

  await auditService.log({
    user: storedToken.user._id,
    module: MODULES.AUTH,
    action: AUDIT_ACTIONS.LOGOUT,
    description: `User ${storedToken.user.userId} logged out successfully.`,
    ipAddress: requestInfo.ipAddress || "",
    userAgent: requestInfo.userAgent || "",
  });

  return true;
}

}

export default new AuthService();