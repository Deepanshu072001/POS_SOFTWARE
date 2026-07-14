import { Role, Permission } from "../models/index.js";
import roles from "../data/roles.js";

const seedRoles = async () => {
  console.log("🌱 Seeding roles...");

  const allPermissions = await Permission.find({
    isDeleted: false,
  });

  for (const role of roles) {
    let permissionIds = [];

    if (role.permissions.includes("*")) {
      permissionIds = allPermissions.map((permission) => permission._id);
    } else {
      permissionIds = allPermissions
        .filter((permission) =>
          role.permissions.includes(permission.name)
        )
        .map((permission) => permission._id);
    }

    await Role.findOneAndUpdate(
      { name: role.name },
      {
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        permissions: permissionIds,
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  console.log(`✅ ${roles.length} roles seeded.`);
};

export default seedRoles;