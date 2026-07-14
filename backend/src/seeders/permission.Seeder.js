import { Permission } from "../models/index.js";
import permissions from "../data/permissions.js";

const seedPermissions = async () => {
  console.log("🌱 Seeding permissions...");

  for (const permission of permissions) {
    const permissionName = `${permission.module}.${permission.action}`.toUpperCase();

    await Permission.findOneAndUpdate(
      { name: permissionName },
      {
        name: permissionName,
        module: permission.module.toUpperCase(),
        action: permission.action.toLowerCase(),
        description: permission.description,
      },
     {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
    }
    );
  }

  console.log(`✅ ${permissions.length} permissions seeded.`);
};

export default seedPermissions;