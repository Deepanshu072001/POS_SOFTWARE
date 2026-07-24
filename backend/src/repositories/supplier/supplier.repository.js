import BaseRepository from "../base/base.repository.js";

import { Supplier } from "../../models/index.js";

class SupplierRepository extends BaseRepository {
  constructor() {
    super(Supplier);
  }

  /*
  |--------------------------------------------------------------------------
  | Finders
  |--------------------------------------------------------------------------
  */

  async findBySupplierId(supplierId) {
    return this.model.findOne({
      supplierId,
      isDeleted: false,
    });
  }

  async findByCode(code) {
    return this.model.findOne({
      code: code.toUpperCase(),
      isDeleted: false,
    });
  }

  async findByPhone(phone) {
    return this.model.findOne({
      phone,
      isDeleted: false,
    });
  }

  async findByEmail(email) {
    return this.model.findOne({
      email: email?.toLowerCase(),
      isDeleted: false,
    });
  }

  async findByGST(gstNumber) {
    return this.model.findOne({
      gstNumber: gstNumber?.toUpperCase(),
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Exists
  |--------------------------------------------------------------------------
  */

  async existsByName(name) {
    return this.model.exists({
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

  async existsByPhone(phone) {
    return this.model.exists({
      phone,
      isDeleted: false,
    });
  }

  async existsByEmail(email) {
    if (!email) return false;

    return this.model.exists({
      email: email.toLowerCase(),
      isDeleted: false,
    });
  }

  async existsByGST(gstNumber) {
    if (!gstNumber) return false;

    return this.model.exists({
      gstNumber: gstNumber.toUpperCase(),
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Balance
  |--------------------------------------------------------------------------
  */

  async updateCurrentBalance(id, amount) {
    return this.model.findByIdAndUpdate(
      id,
      {
        currentBalance: amount,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export default new SupplierRepository();