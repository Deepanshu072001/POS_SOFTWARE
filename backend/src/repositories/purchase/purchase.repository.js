import BaseRepository from "../base/base.repository.js";

import { Purchase } from "../../models/index.js";

class PurchaseRepository extends BaseRepository {
  constructor() {
    super(Purchase);
  }

  /*
  |--------------------------------------------------------------------------
  | Finders
  |--------------------------------------------------------------------------
  */

  async findByPurchaseId(purchaseId) {
    return this.model.findOne({
      purchaseId,
      isDeleted: false,
    });
  }

  async findByPurchaseNumber(purchaseNumber) {
    return this.model.findOne({
      purchaseNumber,
      isDeleted: false,
    });
  }

  async findByInvoiceNumber(invoiceNumber) {
    return this.model.findOne({
      invoiceNumber,
      isDeleted: false,
    });
  }

  async findWithRelations(id) {
    return this.model
      .findById(id)
      .populate([
        {
          path: "supplier",
        },
        {
          path: "branch",
        },
        {
          path: "createdBy",
          select: "userId firstName lastName",
        },
        {
          path: "updatedBy",
          select: "userId firstName lastName",
        },
        {
          path: "approvedBy",
          select: "userId firstName lastName",
        },
      ]);
  }

  /*
  |--------------------------------------------------------------------------
  | Exists
  |--------------------------------------------------------------------------
  */

  async existsByPurchaseNumber(purchaseNumber) {
    return this.model.exists({
      purchaseNumber,
      isDeleted: false,
    });
  }

  async existsByInvoiceNumber(invoiceNumber) {
    if (!invoiceNumber) return false;

    return this.model.exists({
      invoiceNumber,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  async updatePurchaseStatus(id, purchaseStatus) {
    return this.model.findByIdAndUpdate(
      id,
      { purchaseStatus },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updatePaymentStatus(id, paymentStatus) {
    return this.model.findByIdAndUpdate(
      id,
      { paymentStatus },
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export default new PurchaseRepository();