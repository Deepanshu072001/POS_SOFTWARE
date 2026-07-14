import userRepository from "../../repositories/auth/user.repository.js";
import roleRepository from "../../repositories/auth/role.repository.js";

import { AuditLog } from "../../models/index.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";

import ROLES from "../../constants/roles.js";

import AppError from "../../utils/AppError.js";

class AuthService {
  async register(userData, requestInfo = {}) {
    // Check if email already exists
    const existingUser = await userRepository.exists(userData.email);

    if (existingUser) {
      throw new AppError("Email already exists.", 409);
    }

    // Find default role
    const role = await roleRepository.findByName(ROLES.CASHIER);

    if (!role) {
      throw new AppError(
        "Default role not found. Please run role seeder.",
        500
      );
    }

    // Generate Business ID
    const userId = await generateBusinessId("USER", "USR");

    // Create User
    const user = await userRepository.create({
      userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: role._id,
    });

    // Create Audit Log
    await AuditLog.create({
      user: user._id,
      module: "AUTH",
      action: "REGISTER",
      description: `User ${user.userId} registered successfully.`,
      ipAddress: requestInfo.ipAddress || "",
      userAgent: requestInfo.userAgent || "",
    });

    // Return created user
    return await userRepository.findById(user._id);
  }
}

export default new AuthService();