import { Role } from "../../models/index.js";

class RoleRepository {

    async findByName(name) {

        return await Role.findOne({
            name
        });

    }

    async findById(id) {

        return await Role.findById(id);

    }

}

export default new RoleRepository();