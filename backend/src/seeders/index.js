import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDatabase from "../config/database.js";

import seedPermissions from "./permission.Seeder.js";
import seedRoles from "./role.Seeder.js";
import seedCounters from "./counters.seeder.js";
import seedAdmin from "./admin.Seeder.js";

dotenv.config();

const runSeeders = async () => {
  try {
    console.log("==================================");
    console.log("🌱 CafeFlow POS Database Seeder");
    console.log("==================================");

    await connectDatabase();

    await seedPermissions();
    await seedRoles();
    await seedCounters();
    await seedAdmin();

    console.log("==================================");
    console.log("✅ Database seeding completed.");
    console.log("==================================");
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed.");
    }
  }
};

runSeeders();