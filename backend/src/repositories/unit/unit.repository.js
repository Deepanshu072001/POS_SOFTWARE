import BaseRepository from "../base/base.repository.js";

import { Unit } from "../../models/index.js";

class UnitRepository extends BaseRepository {
  constructor() {
    super(Unit);
  }

  async findByUnitId(unitId) {
    return this.model.findOne({
      unitId,
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

  async findBySymbol(symbol) {
    return this.model.findOne({
      symbol,
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

  async existsBySymbol(symbol) {
    return this.model.exists({
      symbol,
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
            symbol: {
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
}

export default new UnitRepository();