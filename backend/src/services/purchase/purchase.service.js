import purchaseRepository from "../../repositories/purchase/purchase.repository.js";
import purchaseItemRepository from "../../repositories/purchase/purchaseItem.repository.js";

import supplierRepository from "../../repositories/supplier/supplier.repository.js";
import branchRepository from "../../repositories/branch/branch.repository.js";
import variantRepository from "../../repositories/product/variant.repository.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import PURCHASE_STATUS from "../../constants/purchaseStatus.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";

import auditService from "../audit/audit.service.js";

import AppError from "../../utils/AppError.js";

class PurchaseService {
  /*
  |--------------------------------------------------------------------------
  | Validate Relations
  |--------------------------------------------------------------------------
  */

  async validateRelations(data) {
    const supplier = await supplierRepository.findActiveById(
      data.supplier
    );

    if (!supplier) {
      throw new AppError("Supplier not found.", 404);
    }

    const branch = await branchRepository.findActiveById(
      data.branch
    );

    if (!branch) {
      throw new AppError("Branch not found.", 404);
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new AppError(
        "At least one purchase item is required.",
        400
      );
    }

    for (const item of data.items) {
      const variant =
        await variantRepository.findActiveById(
          item.variant
        );

      if (!variant) {
        throw new AppError(
          "Invalid product variant.",
          404
        );
      }

      if (Number(item.quantity) <= 0) {
        throw new AppError(
          "Quantity must be greater than zero.",
          400
        );
      }

      if (Number(item.unitCost) < 0) {
        throw new AppError(
          "Unit cost cannot be negative.",
          400
        );
      }
    }

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Calculate Totals
  |--------------------------------------------------------------------------
  */

  calculateTotals(items) {
    let subtotal = 0;
    let discountAmount = 0;
    let taxAmount = 0;

    const purchaseItems = items.map((item) => {
      const quantity = Number(item.quantity);
      const freeQuantity = Number(item.freeQuantity || 0);

      const unitCost = Number(item.unitCost);

      const discountPercentage = Number(
        item.discountPercentage || 0
      );

      const taxPercentage = Number(
        item.taxPercentage || 0
      );

      let discount = Number(
        item.discountAmount || 0
      );

      if (
        discount === 0 &&
        discountPercentage > 0
      ) {
        discount =
          (quantity *
            unitCost *
            discountPercentage) /
          100;
      }

      let tax = Number(item.taxAmount || 0);

      if (
        tax === 0 &&
        taxPercentage > 0
      ) {
        tax =
          ((quantity * unitCost - discount) *
            taxPercentage) /
          100;
      }

      const lineTotal =
        quantity * unitCost -
        discount +
        tax;

      subtotal += quantity * unitCost;
      discountAmount += discount;
      taxAmount += tax;

      return {
        variant: item.variant,

        quantity,

        freeQuantity,

        receivedQuantity:
          item.receivedQuantity || 0,

        unitCost,

        discountPercentage,

        discountAmount: discount,

        taxPercentage,

        taxAmount: tax,

        lineTotal,

        batchNumber:
          item.batchNumber || "",

        manufacturingDate:
          item.manufacturingDate ||
          null,

        expiryDate:
          item.expiryDate || null,

        remarks:
          item.remarks || "",
      };
    });

    return {
      purchaseItems,

      subtotal,

      discountAmount,

      taxAmount,

      grandTotal:
        subtotal -
        discountAmount +
        taxAmount,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Create Purchase
  |--------------------------------------------------------------------------
  */

  async create(
    data,
    currentUser,
    requestInfo = {}
  ) {
    await this.validateRelations(data);

    const totals =
      this.calculateTotals(data.items);

    const purchaseId =
      await generateBusinessId(
        BUSINESS_IDS.PURCHASE.name,
        BUSINESS_IDS.PURCHASE.prefix
      );

    const purchaseNumber =
      await generateBusinessId(
        "PURCHASE_NUMBER",
        "PO"
      );

    const purchase =
      await purchaseRepository.create({
        purchaseId,

        purchaseNumber,

        supplier: data.supplier,

        branch: data.branch,

        invoiceNumber:
          data.invoiceNumber || "",

        invoiceDate:
          data.invoiceDate,

        purchaseDate:
          data.purchaseDate ||
          new Date(),

        purchaseType:
          data.purchaseType,

        expectedDeliveryDate:
          data.expectedDeliveryDate,

        notes:
          data.notes || "",

        subtotal:
          totals.subtotal,

        discountAmount:
          totals.discountAmount,

        taxAmount:
          totals.taxAmount,

        shippingCharge:
          Number(
            data.shippingCharge || 0
          ),

        roundOff:
          Number(
            data.roundOff || 0
          ),

        grandTotal:
          totals.grandTotal +
          Number(
            data.shippingCharge || 0
          ) +
          Number(
            data.roundOff || 0
          ),

        paidAmount: 0,

        dueAmount:
          totals.grandTotal +
          Number(
            data.shippingCharge || 0
          ) +
          Number(
            data.roundOff || 0
          ),

        purchaseStatus:
          PURCHASE_STATUS.DRAFT,

        createdBy:
          currentUser._id,
      });

    for (const item of totals.purchaseItems) {
      await purchaseItemRepository.create({
        purchaseItemId:
          await generateBusinessId(
            BUSINESS_IDS.PURCHASE_ITEM.name,
            BUSINESS_IDS.PURCHASE_ITEM.prefix
          ),

        purchase: purchase._id,

        ...item,

        createdBy:
          currentUser._id,
      });
    }

    await auditService.log({
      user: currentUser._id,

      module: MODULES.PURCHASE,

      action: AUDIT_ACTIONS.CREATE,

      description: `Purchase ${purchase.purchaseNumber} created.`,

      ipAddress:
        requestInfo.ipAddress,

      userAgent:
        requestInfo.userAgent,
    });

    return this.findById(
      purchase._id
    );
  }

   /*
  |--------------------------------------------------------------------------
  | Get Purchases
  |--------------------------------------------------------------------------
  */

  async findAll(query = {}) {
    const filter = {
      isDeleted: false,
    };

    if (query.branch) {
      filter.branch = query.branch;
    }

    if (query.supplier) {
      filter.supplier = query.supplier;
    }

    if (query.purchaseStatus) {
      filter.purchaseStatus =
        query.purchaseStatus;
    }

    if (query.paymentStatus) {
      filter.paymentStatus =
        query.paymentStatus;
    }

    if (query.status) {
      filter.status = query.status;
    }

    return purchaseRepository.paginate({
      filter,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sort: {
        purchaseDate: -1,
        createdAt: -1,
      },
      populate: [
        {
          path: "supplier",
          select:
            "supplierId code name phone",
        },
        {
          path: "branch",
          select:
            "branchId code name",
        },
        {
          path: "createdBy",
          select:
            "userId firstName lastName",
        },
      ],
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get Purchase By Id
  |--------------------------------------------------------------------------
  */

  async findById(id) {
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

    const items =
      await purchaseItemRepository.findByPurchase(
        purchase._id
      );

    return {
      purchase,
      items,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Draft Purchase
  |--------------------------------------------------------------------------
  */

  async update(
    id,
    data,
    currentUser,
    requestInfo = {}
  ) {
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

    if (
      purchase.purchaseStatus !==
      PURCHASE_STATUS.DRAFT
    ) {
      throw new AppError(
        "Only draft purchases can be updated.",
        400
      );
    }

    await this.validateRelations(data);

    const totals =
      this.calculateTotals(
        data.items
      );

    await purchaseRepository.update(
      purchase._id,
      {
        supplier:
          data.supplier,

        branch:
          data.branch,

        invoiceNumber:
          data.invoiceNumber || "",

        invoiceDate:
          data.invoiceDate,

        purchaseDate:
          data.purchaseDate,

        purchaseType:
          data.purchaseType,

        expectedDeliveryDate:
          data.expectedDeliveryDate,

        notes:
          data.notes || "",

        subtotal:
          totals.subtotal,

        discountAmount:
          totals.discountAmount,

        taxAmount:
          totals.taxAmount,

        shippingCharge:
          Number(
            data.shippingCharge || 0
          ),

        roundOff:
          Number(
            data.roundOff || 0
          ),

        grandTotal:
          totals.grandTotal +
          Number(
            data.shippingCharge || 0
          ) +
          Number(
            data.roundOff || 0
          ),

        dueAmount:
          totals.grandTotal +
          Number(
            data.shippingCharge || 0
          ) +
          Number(
            data.roundOff || 0
          ),

        updatedBy:
          currentUser._id,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Replace Purchase Items
    |--------------------------------------------------------------------------
    */

    const existingItems =
      await purchaseItemRepository.findByPurchase(
        purchase._id
      );

    for (const item of existingItems) {
      await purchaseItemRepository.softDelete(
        item._id,
        currentUser._id
      );
    }

    for (const item of totals.purchaseItems) {
      await purchaseItemRepository.create({
        purchaseItemId:
          await generateBusinessId(
            BUSINESS_IDS.PURCHASE_ITEM.name,
            BUSINESS_IDS.PURCHASE_ITEM.prefix
          ),

        purchase:
          purchase._id,

        ...item,

        createdBy:
          currentUser._id,
      });
    }

    await auditService.log({
      user:
        currentUser._id,

      module:
        MODULES.PURCHASE,

      action:
        AUDIT_ACTIONS.UPDATE,

      description:
        `Purchase ${purchase.purchaseNumber} updated.`,

      ipAddress:
        requestInfo.ipAddress,

      userAgent:
        requestInfo.userAgent,
    });

    return this.findById(
      purchase._id
    );
  }

   /*
  |--------------------------------------------------------------------------
  | Delete Draft Purchase
  |--------------------------------------------------------------------------
  */

  async delete(
    id,
    currentUser,
    requestInfo = {}
  ) {
    const purchase =
      await purchaseRepository.findWithRelations(id);

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
        "Only draft purchases can be deleted.",
        400
      );
    }

    const items =
      await purchaseItemRepository.findByPurchase(
        purchase._id
      );

    for (const item of items) {
      await purchaseItemRepository.softDelete(
        item._id,
        currentUser._id
      );
    }

    await purchaseRepository.softDelete(
      purchase._id,
      currentUser._id
    );

    await auditService.log({
      user: currentUser._id,

      module: MODULES.PURCHASE,

      action: AUDIT_ACTIONS.DELETE,

      description: `Purchase ${purchase.purchaseNumber} deleted.`,

      ipAddress:
        requestInfo.ipAddress,

      userAgent:
        requestInfo.userAgent,
    });

    return {
      success: true,
      message:
        "Purchase deleted successfully.",
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Purchase Summary
  |--------------------------------------------------------------------------
  */

  async summary(id) {
    const result =
      await this.findById(id);

    const purchase =
      result.purchase;

    const items =
      result.items;

    const totalItems =
      items.length;

    const totalQuantity =
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity) +
          Number(item.freeQuantity || 0),
        0
      );

    const totalTax =
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.taxAmount || 0),
        0
      );

    const totalDiscount =
      items.reduce(
        (sum, item) =>
          sum +
          Number(
            item.discountAmount || 0
          ),
        0
      );

    return {
      purchase,

      items,

      summary: {
        totalItems,

        totalQuantity,

        subtotal:
          purchase.subtotal,

        discountAmount:
          totalDiscount,

        taxAmount:
          totalTax,

        shippingCharge:
          purchase.shippingCharge,

        roundOff:
          purchase.roundOff,

        grandTotal:
          purchase.grandTotal,

        paidAmount:
          purchase.paidAmount,

        dueAmount:
          purchase.dueAmount,
      },
    };
  }
}

export default new PurchaseService();