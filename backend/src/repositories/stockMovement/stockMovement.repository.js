import BaseRepository from "../base/base.repository.js";

import { StockMovement } from "../../models/index.js";

class StockMovementRepository extends BaseRepository {
  constructor() {
    super(StockMovement);
  }

  /*
  |--------------------------------------------------------------------------
  | Finders
  |--------------------------------------------------------------------------
  */

  async findByMovementId(movementId) {
    return this.model.findOne({
      movementId,
      isDeleted: false,
    });
  }

  async findByInventory(inventoryId) {
    return this.model
      .find({
        inventory: inventoryId,
        isDeleted: false,
      })
      .sort({
        createdAt: -1,
      });
  }

  async findByVariant(variantId) {
    return this.model
      .find({
        variant: variantId,
        isDeleted: false,
      })
      .sort({
        createdAt: -1,
      });
  }

  async findByBranch(branchId) {
    return this.model
      .find({
        branch: branchId,
        isDeleted: false,
      })
      .sort({
        createdAt: -1,
      });
  }

  async findWithRelations(id) {
  return this.model
    .findById(id)
    .populate([
      {
        path: "branch",
      },
      {
        path: "variant",
        populate: {
          path: "product",
        },
      },
      {
        path: "inventory",
      },
      {
        path: "createdBy",
        select: "userId firstName lastName",
      },
      {
        path: "updatedBy",
        select: "userId firstName lastName",
      },
    ]);
}

  async findByReference(referenceType, referenceId) {
    return this.model.find({
      referenceType,
      referenceId,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Reports
  |--------------------------------------------------------------------------
  */

  async findStockIn() {
    return this.model.find({
      direction: "IN",
      isDeleted: false,
    });
  }

  async findStockOut() {
    return this.model.find({
      direction: "OUT",
      isDeleted: false,
    });
  }

  async findByDateRange(from, to) {
    return this.model.find({
      createdAt: {
        $gte: from,
        $lte: to,
      },
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

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
/*
  |--------------------------------------------------------------------------
  | Stocks Latest Movement 
  |--------------------------------------------------------------------------
  */

  async findLatestMovement(inventoryId) {
  return this.model
    .findOne({
      inventory: inventoryId,
      isDeleted: false,
    })
    .sort({
      createdAt: -1,
    });
}



}

export default new StockMovementRepository();