import BaseRepository from "../base/base.repository.js";

import { PurchaseItem } from "../../models/index.js";

class PurchaseItemRepository extends BaseRepository {
  constructor() {
    super(PurchaseItem);
  }

  /*
  |--------------------------------------------------------------------------
  | Finders
  |--------------------------------------------------------------------------
  */

  async findByPurchase(purchaseId) {
    return this.model
      .find({
        purchase: purchaseId,
        isDeleted: false,
      })
      .populate({
        path: "variant",
        populate: {
          path: "product",
        },
      });
  }

  async findByVariant(variantId) {
    return this.model.find({
      variant: variantId,
      isDeleted: false,
    });
  }

  async findWithRelations(id) {
    return this.model
      .findById(id)
      .populate([
        {
          path: "purchase",
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
  | Calculate Total Purchase
  |--------------------------------------------------------------------------
  */

  async calculatePurchaseTotal(purchaseId) {
  return this.model.aggregate([
    {
      $match: {
        purchase: purchaseId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$purchase",
        subtotal: {
          $sum: "$lineTotal",
        },
        taxAmount: {
          $sum: "$taxAmount",
        },
        discountAmount: {
          $sum: "$discountAmount",
        },
      },
    },
  ]);
}

  /*
  |--------------------------------------------------------------------------
  | Reports
  |--------------------------------------------------------------------------
  */

  async findByDateRange(from, to) {
    return this.model.find({
      createdAt: {
        $gte: from,
        $lte: to,
      },
      isDeleted: false,
    });
  }
}

export default new PurchaseItemRepository();