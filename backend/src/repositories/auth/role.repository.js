import { Role } from "../../models/index.js";
import STATUS from "../../constants/status.js";

class RoleRepository {
  async findByName(name) {
    return Role.findOne({
      name,
      status: STATUS.ACTIVE,
      isDeleted: false,
    }).populate("permissions");
  }

  async findById(id) {
    return Role.findOne({
      _id: id,
      status: STATUS.ACTIVE,
      isDeleted: false,
    }).populate("permissions");
  }
}

export default new RoleRepository();