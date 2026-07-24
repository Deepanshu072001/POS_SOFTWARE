import BaseRepository from "../base/base.repository.js";

import { Inventory } from "../../models/index.js";

class InventoryRepository extends BaseRepository {
  constructor() {
    super(Inventory);
  }

  /*
  |--------------------------------------------------------------------------
  | Finders
  |--------------------------------------------------------------------------
  */

  async findByInventoryId(inventoryId) {
    return this.model.findOne({
      inventoryId,
      isDeleted: false,
    });
  }

  async findByBranchAndVariant(branchId, variantId) {
    return this.model.findOne({
      branch: branchId,
      variant: variantId,
      isDeleted: false,
    });
  }

  async findByBranch(branchId) {
    return this.model
      .find({
        branch: branchId,
        isDeleted: false,
      })
      .populate("variant");
  }

  async findByVariant(variantId) {
    return this.model
      .find({
        variant: variantId,
        isDeleted: false,
      })
      .populate("branch");
  }

  async findWithRelations(id) {
    return this.model
      .findOne({
        _id: id,
        isDeleted: false,
      })
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
          path: "createdBy",
          select: "userId firstName lastName",
        },
        {
          path: "updatedBy",
          select: "userId firstName lastName",
        },
      ]);
  }

  /*
  |--------------------------------------------------------------------------
  | Exists
  |--------------------------------------------------------------------------
  */

  async exists(branchId, variantId) {
    return this.model.exists({
      branch: branchId,
      variant: variantId,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Stock Operations
  |--------------------------------------------------------------------------
  */

  async updateStock(id, stockData) {
    return this.model.findByIdAndUpdate(
      id,
      stockData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async increaseStock(id, quantity) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $inc: {
          currentStock: quantity,
          availableStock: quantity,
        },
      },
      {
        new: true,
      }
    );
  }

  async decreaseStock(id, quantity) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $inc: {
          currentStock: -quantity,
          availableStock: -quantity,
        },
      },
      {
        new: true,
      }
    );
  }

  async canSell(id, quantity) {
    return this.model.findOne({
      _id: id,
      availableStock: {
        $gte: quantity,
      },
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Reports
  |--------------------------------------------------------------------------
  */

  async findLowStock() {
    return this.model.find({
      isDeleted: false,
      $expr: {
        $lte: [
          "$availableStock",
          "$minimumStock",
        ],
      },
    });
  }

  async findReorderItems() {
    return this.model.find({
      isDeleted: false,
      $expr: {
        $lte: [
          "$availableStock",
          "$reorderLevel",
        ],
      },
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
}

export default new InventoryRepository();