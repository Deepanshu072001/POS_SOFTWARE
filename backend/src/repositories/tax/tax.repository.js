import BaseRepository from "../base/base.repository.js";

import { Tax } from "../../models/index.js";

class TaxRepository extends BaseRepository {
  constructor() {
    super(Tax);
  }

  async findByTaxId(taxId) {
    return this.model.findOne({
      taxId,
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

  async search(keyword) {
    return this.paginateActive({
      filter: {
        $or: [
          {
            name: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            code: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            description: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      },
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

  async unsetDefault() {
    return this.model.updateMany(
      { isDefault: true },
      { isDefault: false }
    );
  }
}

export default new TaxRepository();