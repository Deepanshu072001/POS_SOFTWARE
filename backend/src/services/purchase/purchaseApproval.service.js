import purchaseRepository from "../../repositories/purchase/purchase.repository.js";
import purchaseItemRepository from "../../repositories/purchase/purchaseItem.repository.js";
import inventoryRepository from "../../repositories/inventory/inventory.repository.js";
import supplierRepository from "../../repositories/supplier/supplier.repository.js";

import stockMovementService from "../stockMovement/stockMovement.service.js";
import auditService from "../audit/audit.service.js";

import PURCHASE_STATUS from "../../constants/purchaseStatus.js";
import PAYMENT_STATUS from "../../constants/paymentStatus.js";
import REFERENCE_TYPES from "../../constants/referenceTypes.js";
import MOVEMENT_TYPES from "../../constants/movementTypes.js";
import MOVEMENT_DIRECTIONS from "../../constants/movementDirections.js";

import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";

import AppError from "../../utils/AppError.js";

class PurchaseApprovalService {

      /*
  |--------------------------------------------------------------------------
  | Get Purchase
  |--------------------------------------------------------------------------
  */

  async getPurchase(id) {
    const purchase =
      await purchaseRepository.findWithRelations(
        id
      );

    if (!purchase || purchase.isDeleted) {
      throw new AppError(
        "Purchase not found.",
        404
      );
    }

    return purchase;
  }
  /*
  |--------------------------------------------------------------------------
  | Approve Purchase
  |--------------------------------------------------------------------------
  */

  async approve(
    purchaseId,
    currentUser,
    requestInfo = {}
  ) {
    const purchase =
      await purchaseRepository.findWithRelations(
        purchaseId
      );

    if (!purchase || purchase.isDeleted) {
      throw new AppError(
        "Purchase not found.",
        404
      );
    }

    if (
      purchase.purchaseStatus !==
      PURCHASE_STATUS.DRAFT
    ) {
      throw new AppError(
        "Only draft purchases can be approved.",
        400
      );
    }

    const items =
      await purchaseItemRepository.findByPurchase(
        purchase._id
      );

    if (!items.length) {
      throw new AppError(
        "Purchase contains no items.",
        400
      );
    }

    for (const item of items) {
      const inventory =
        await inventoryRepository.findByBranchAndVariant(
          purchase.branch._id,
          item.variant._id
        );

      if (!inventory) {
        throw new AppError(
          `Inventory not found for ${item.variant.product.name}.`,
          404
        );
      }

      await stockMovementService.create(
        {
          inventory: inventory._id,

          type:
            MOVEMENT_TYPES.PURCHASE,

          direction:
            MOVEMENT_DIRECTIONS.IN,

          quantity:
            Number(item.quantity) +
            Number(item.freeQuantity || 0),

          unitCost:
            item.unitCost,

          referenceType:
            REFERENCE_TYPES.PURCHASE,

          referenceId:
            purchase._id,

          remarks:
            purchase.purchaseNumber,
        },

        currentUser,

        requestInfo
      );
    }

    const supplier =
  await supplierRepository.findActiveById(
    purchase.supplier._id
  );

if (!supplier) {
  throw new AppError(
    "Supplier not found.",
    404
  );
}

if (supplier.status !== "ACTIVE") {
  throw new AppError(
    "Supplier is inactive.",
    400
  );
}

await supplierRepository.updateCurrentBalance(
  supplier._id,
  supplier.currentBalance +
    purchase.dueAmount
);

    const updatedPurchase =
      await purchaseRepository.update(
        purchase._id,
        {
          purchaseStatus:
            PURCHASE_STATUS.APPROVED,

          paymentStatus:
            PAYMENT_STATUS.UNPAID,

          approvedBy:
            currentUser._id,

          approvedAt:
            new Date(),

          updatedBy:
            currentUser._id,
        }
      );

    await auditService.log({
      user: currentUser._id,

      module: MODULES.PURCHASE,

      action: AUDIT_ACTIONS.UPDATE,

      description: `Purchase ${purchase.purchaseNumber} approved.`,

      ipAddress:
        requestInfo.ipAddress,

      userAgent:
        requestInfo.userAgent,
    });

    return updatedPurchase;
  }

  /* =======================================================================
     PART 2 STARTS BELOW
     ======================================================================= */

       /*
  |--------------------------------------------------------------------------
  | Receive Purchase
  |--------------------------------------------------------------------------
  */

  async receive(
    purchaseId,
    currentUser,
    requestInfo = {}
  ) {
    const purchase =
      await purchaseRepository.findWithRelations(
        purchaseId
      );

    if (!purchase || purchase.isDeleted) {
      throw new AppError(
        "Purchase not found.",
        404
      );
    }

    if (
      purchase.purchaseStatus !==
      PURCHASE_STATUS.APPROVED
    ) {
      throw new AppError(
        "Only approved purchases can be received.",
        400
      );
    }

    const updatedPurchase =
      await purchaseRepository.update(
        purchase._id,
        {
          purchaseStatus:
            PURCHASE_STATUS.RECEIVED,

          receivedDate:
            new Date(),

          updatedBy:
            currentUser._id,
        }
      );

    await auditService.log({
      user: currentUser._id,

      module: MODULES.PURCHASE,

      action: AUDIT_ACTIONS.UPDATE,

      description: `Purchase ${purchase.purchaseNumber} marked as received.`,

      ipAddress:
        requestInfo.ipAddress,

      userAgent:
        requestInfo.userAgent,
    });

    return updatedPurchase;
  }

  /*
  |--------------------------------------------------------------------------
  | Cancel Purchase
  |--------------------------------------------------------------------------
  */

  async cancel(
    purchaseId,
    currentUser,
    requestInfo = {}
  ) {
    const purchase =
      await purchaseRepository.findWithRelations(
        purchaseId
      );

    if (!purchase || purchase.isDeleted) {
      throw new AppError(
        "Purchase not found.",
        404
      );
    }

    if (
  purchase.purchaseStatus ===
    PURCHASE_STATUS.APPROVED ||
  purchase.purchaseStatus ===
    PURCHASE_STATUS.RECEIVED
) {
  throw new AppError(
    "Approved or received purchases cannot be cancelled.",
    400
  );
}

    if (
      purchase.purchaseStatus ===
      PURCHASE_STATUS.CANCELLED
    ) {
      throw new AppError(
        "Purchase is already cancelled.",
        400
      );
    }

    const updatedPurchase =
      await purchaseRepository.update(
        purchase._id,
        {
          purchaseStatus:
            PURCHASE_STATUS.CANCELLED,

          updatedBy:
            currentUser._id,
        }
      );

    await auditService.log({
      user: currentUser._id,

      module: MODULES.PURCHASE,

      action: AUDIT_ACTIONS.UPDATE,

      description: `Purchase ${purchase.purchaseNumber} cancelled.`,

      ipAddress:
        requestInfo.ipAddress,

      userAgent:
        requestInfo.userAgent,
    });

    return updatedPurchase;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Purchase Status
  |--------------------------------------------------------------------------
  */

  async getStatus(id) {
    const purchase =
      await purchaseRepository.findById(id);

    if (!purchase || purchase.isDeleted) {
      throw new AppError(
        "Purchase not found.",
        404
      );
    }

    return {
      purchaseId:
        purchase.purchaseId,

      purchaseNumber:
        purchase.purchaseNumber,

      purchaseStatus:
        purchase.purchaseStatus,

      paymentStatus:
        purchase.paymentStatus,

      grandTotal:
        purchase.grandTotal,

      paidAmount:
        purchase.paidAmount,

      dueAmount:
        purchase.dueAmount,
    };
  }
}

export default new PurchaseApprovalService();