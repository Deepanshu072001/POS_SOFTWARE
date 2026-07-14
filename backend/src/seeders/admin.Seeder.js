import { User, Role } from "../models/index.js";
import generateBusinessId from "../helpers/generateBusinessId.js";

const seedAdmin = async () => {
  console.log("🌱 Seeding owner account...");

  const existingOwner = await User.findOne({
    email: "owner@cafeflow.com",
  });

  if (existingOwner) {
    console.log("✅ Owner account already exists.");
    return;
  }

  const ownerRole = await Role.findOne({
    name: "OWNER",
  });

  if (!ownerRole) {
    throw new Error(
      "OWNER role not found. Please seed roles first."
    );
  }

  const userId = await generateBusinessId("USER", "USR");

  await User.create({
    userId,
    firstName: "System",
    lastName: "Owner",
    email: "owner@cafeflow.com",
    phone: "9999999999",
    password: "Owner@123",
    role: ownerRole._id,
    isEmailVerified: true,
  });

  console.log("✅ Owner account created.");
};

export default seedAdmin;