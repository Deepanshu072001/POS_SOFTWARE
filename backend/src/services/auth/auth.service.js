import userRepository from "../../repositories/auth/user.repository.js";
import roleRepository from "../../repositories/auth/role.repository.js";
import refreshTokenRepository from "../../repositories/auth/refreshToken.repository.js";

import { AuditLog } from "../../models/index.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.js";

import ROLES from "../../constants/roles.js";
import STATUS from "../../constants/status.js";

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

    await AuditLog.create({
      user: user._id,
      module: "AUTH",
      action: "REGISTER",
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

    await AuditLog.create({
      user: user._id,
      module: "AUTH",
      action: "LOGIN",
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
}

export default new AuthService();