import BaseRepository from "../base/base.repository.js";

import { Branch } from "../../models/index.js";

class BranchRepository extends BaseRepository {
  constructor() {
    super(Branch);
  }

  async findByBranchId(branchId) {
    return this.model.findOne({
      branchId,
      isDeleted: false,
    });
  }

  async findByCode(code) {
    return this.model.findOne({
      code: code.toUpperCase(),
      isDeleted: false,
    });
  }

  async findByName(name) {
    return this.model.findOne({
      name,
      isDeleted: false,
    });
  }

  async search(search) {
    return this.model.find({
      isDeleted: false,
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          code: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "address.city": {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });
  }

  async updateStatus(id, status) {
    return this.model.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async existsByCode(code) {
    return this.model.exists({
      code: code.toUpperCase(),
      isDeleted: false,
    });
  }

  async existsByName(name) {
    return this.model.exists({
      name,
      isDeleted: false,
    });
  }
}

export default new BranchRepository();