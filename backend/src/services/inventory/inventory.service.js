import inventoryRepository from "../../repositories/inventory/inventory.repository.js";
import branchRepository from "../../repositories/branch/branch.repository.js";
import variantRepository from "../../repositories/product/variant.repository.js";

import auditService from "../audit/audit.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";
import calculateAvailableStock from "../../helpers/calculateAvailableStock.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";

import AppError from "../../utils/AppError.js";

class InventoryService {
  /*
  |--------------------------------------------------------------------------
  | Validate Relations
  |--------------------------------------------------------------------------
  */

  async validateRelations(branchId, variantId) {
    const branch =
      await branchRepository.findActiveById(branchId);

    if (!branch) {
      throw new AppError(
        "Branch not found.",
        404
      );
    }

    const variant =
      await variantRepository.findActiveById(variantId);

    if (!variant) {
      throw new AppError(
        "Variant not found.",
        404
      );
    }

    return { branch, variant };
  }

  /*
  |--------------------------------------------------------------------------
  | Create Inventory
  |--------------------------------------------------------------------------
  */

  async create(
    data,
    currentUser,
    requestInfo = {}
  ) {
    const { branch, variant } =
      await this.validateRelations(
        data.branch,
        data.variant
      );

    const exists =
      await inventoryRepository.exists(
        data.branch,
        data.variant
      );

    if (exists) {
      throw new AppError(
        "Inventory already exists for this branch and variant.",
        409
      );
    }

    data.availableStock =
      calculateAvailableStock(
        data.currentStock || 0,
        data.reservedStock || 0
      );

    const inventoryId =
      await generateBusinessId(
        BUSINESS_IDS.INVENTORY.name,
        BUSINESS_IDS.INVENTORY.prefix
      );

    const inventory =
      await inventoryRepository.create({
        ...data,
        inventoryId,
        createdBy: currentUser._id,
      });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.CREATE,
      description: `Inventory ${inventory.inventoryId} created for ${variant.name} in ${branch.name}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return inventory;
  }

  /*
|--------------------------------------------------------------------------
| Create Missing Inventories
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Create Missing Inventories
|--------------------------------------------------------------------------
*/

async createMissingInventories(currentUser) {
  console.log("=== NEW createMissingInventories ===");
  const branches =
    await branchRepository.findActive();

  const variants =
    await variantRepository.findActive();

  // Nothing to synchronize yet
  if (!branches.length || !variants.length) {
    return;
  }

  for (const branch of branches) {
    for (const variant of variants) {
      const exists =
        await inventoryRepository.findByBranchAndVariant(
          branch._id,
          variant._id
        );

      if (exists) {
        continue;
      }

      const inventoryId =
        await generateBusinessId(
          BUSINESS_IDS.INVENTORY.name,
          BUSINESS_IDS.INVENTORY.prefix
        );

      await inventoryRepository.create({
        inventoryId,

        branch: branch._id,

        variant: variant._id,

        currentStock: 0,

        reservedStock: 0,

        availableStock: 0,

        minimumStock: 0,

        maximumStock: 0,

        reorderLevel: 0,

        createdBy: currentUser._id,
      });
    }
  }
}

     /*
  |--------------------------------------------------------------------------
  | Get Inventories
  |--------------------------------------------------------------------------
  */

  async findAll(query = {}) {
    const filter = {
      isDeleted: false,
    };

    if (query.branch) {
      filter.branch = query.branch;
    }

    if (query.variant) {
      filter.variant = query.variant;
    }

    if (query.status) {
      filter.status = query.status;
    }

    return inventoryRepository.paginate({
      filter,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sort: {
        createdAt: -1,
      },
      populate: [
        {
          path: "branch",
          select: "branchId name code",
        },
        {
          path: "variant",
          populate: {
            path: "product",
            select: "productId name code",
          },
        },
      ],
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get Inventory By ID
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    const inventory =
      await inventoryRepository.findWithRelations(id);

    if (!inventory || inventory.isDeleted) {
      throw new AppError(
        "Inventory not found.",
        404
      );
    }

    return inventory;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Inventory
  |--------------------------------------------------------------------------
  */

  async update(
    id,
    data,
    currentUser,
    requestInfo = {}
  ) {
    const inventory =
      await this.findById(id);

    if (data.branch || data.variant) {
      await this.validateRelations(
        data.branch || inventory.branch._id,
        data.variant || inventory.variant._id
      );
    }

    if (
      data.branch ||
      data.variant
    ) {
      const exists =
        await inventoryRepository.exists(
          data.branch || inventory.branch._id,
          data.variant || inventory.variant._id
        );

      if (
        exists &&
        (
          inventory.branch._id.toString() !==
            (data.branch || inventory.branch._id).toString() ||
          inventory.variant._id.toString() !==
            (data.variant || inventory.variant._id).toString()
        )
      ) {
        throw new AppError(
          "Inventory already exists for this branch and variant.",
          409
        );
      }
    }

    const currentStock =
      data.currentStock ??
      inventory.currentStock;

    const reservedStock =
      data.reservedStock ??
      inventory.reservedStock;

    data.availableStock =
      calculateAvailableStock(
        currentStock,
        reservedStock
      );

    data.updatedBy = currentUser._id;

    const updated =
      await inventoryRepository.update(
        id,
        data
      );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Inventory ${updated.inventoryId} updated.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

    /*
  |--------------------------------------------------------------------------
  | Increase Stock
  |--------------------------------------------------------------------------
  */

  async increaseStock(
    id,
    quantity,
    currentUser,
    requestInfo = {}
  ) {
    if (quantity <= 0) {
      throw new AppError(
        "Quantity must be greater than zero.",
        400
      );
    }

    const inventory = await this.findById(id);

    const currentStock =
      inventory.currentStock + quantity;

    const availableStock =
      calculateAvailableStock(
        currentStock,
        inventory.reservedStock
      );

    const updated =
      await inventoryRepository.update(id, {
        currentStock,
        availableStock,
        updatedBy: currentUser._id,
      });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Stock increased by ${quantity} for Inventory ${inventory.inventoryId}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Decrease Stock
  |--------------------------------------------------------------------------
  */

  async decreaseStock(
    id,
    quantity,
    currentUser,
    requestInfo = {}
  ) {
    if (quantity <= 0) {
      throw new AppError(
        "Quantity must be greater than zero.",
        400
      );
    }

    const inventory = await this.findById(id);

    if (inventory.availableStock < quantity) {
      throw new AppError(
        "Insufficient stock available.",
        400
      );
    }

    const currentStock =
      inventory.currentStock - quantity;

    const availableStock =
      calculateAvailableStock(
        currentStock,
        inventory.reservedStock
      );

    const updated =
      await inventoryRepository.update(id, {
        currentStock,
        availableStock,
        updatedBy: currentUser._id,
      });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Stock decreased by ${quantity} for Inventory ${inventory.inventoryId}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Reserve Stock
  |--------------------------------------------------------------------------
  */

  async reserveStock(
    id,
    quantity,
    currentUser,
    requestInfo = {}
  ) {
    if (quantity <= 0) {
      throw new AppError(
        "Quantity must be greater than zero.",
        400
      );
    }

    const inventory = await this.findById(id);

    if (inventory.availableStock < quantity) {
      throw new AppError(
        "Insufficient available stock.",
        400
      );
    }

    const reservedStock =
      inventory.reservedStock + quantity;

    const availableStock =
      calculateAvailableStock(
        inventory.currentStock,
        reservedStock
      );

    const updated =
      await inventoryRepository.update(id, {
        reservedStock,
        availableStock,
        updatedBy: currentUser._id,
      });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Reserved ${quantity} units for Inventory ${inventory.inventoryId}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Release Reserved Stock
  |--------------------------------------------------------------------------
  */

  async releaseReservedStock(
    id,
    quantity,
    currentUser,
    requestInfo = {}
  ) {
    if (quantity <= 0) {
      throw new AppError(
        "Quantity must be greater than zero.",
        400
      );
    }

    const inventory = await this.findById(id);

    if (inventory.reservedStock < quantity) {
      throw new AppError(
        "Reserved stock is less than requested quantity.",
        400
      );
    }

    const reservedStock =
      inventory.reservedStock - quantity;

    const availableStock =
      calculateAvailableStock(
        inventory.currentStock,
        reservedStock
      );

    const updated =
      await inventoryRepository.update(id, {
        reservedStock,
        availableStock,
        updatedBy: currentUser._id,
      });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Released ${quantity} reserved units for Inventory ${inventory.inventoryId}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

    /*
  |--------------------------------------------------------------------------
  | Change Inventory Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(
    id,
    status,
    currentUser,
    requestInfo = {}
  ) {
    if (!Object.values(STATUS).includes(status)) {
      throw new AppError(
        "Invalid status.",
        400
      );
    }

    const inventory = await this.findById(id);

    const updated =
      await inventoryRepository.updateStatus(
        id,
        status
      );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Inventory ${inventory.inventoryId} status changed to ${status}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Inventory
  |--------------------------------------------------------------------------
  */

  async delete(
    id,
    currentUser,
    requestInfo = {}
  ) {
    const inventory = await this.findById(id);

    if (inventory.currentStock > 0) {
      throw new AppError(
        "Inventory with available stock cannot be deleted.",
        400
      );
    }

    await inventoryRepository.softDelete(
      id,
      currentUser._id
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.DELETE,
      description: `Inventory ${inventory.inventoryId} deleted.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return true;
  }

    /*
  |--------------------------------------------------------------------------
  | Change Inventory Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(
    id,
    status,
    currentUser,
    requestInfo = {}
  ) {
    if (!Object.values(STATUS).includes(status)) {
      throw new AppError(
        "Invalid status.",
        400
      );
    }

    const inventory = await this.findById(id);

    const updated =
      await inventoryRepository.updateStatus(
        id,
        status
      );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Inventory ${inventory.inventoryId} status changed to ${status}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Inventory
  |--------------------------------------------------------------------------
  */

  async delete(
    id,
    currentUser,
    requestInfo = {}
  ) {
    const inventory = await this.findById(id);

    // Prevent deletion if stock exists
    if (
      inventory.currentStock > 0 ||
      inventory.reservedStock > 0
    ) {
      throw new AppError(
        "Inventory with stock or reserved stock cannot be deleted.",
        400
      );
    }

    await inventoryRepository.softDelete(
      id,
      currentUser._id
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.DELETE,
      description: `Inventory ${inventory.inventoryId} deleted.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Low Stock Items
  |--------------------------------------------------------------------------
  */

  async findLowStock() {
    return inventoryRepository.findLowStock();
  }

  /*
  |--------------------------------------------------------------------------
  | Reorder Items
  |--------------------------------------------------------------------------
  */

  async findReorderItems() {
    return inventoryRepository.findReorderItems();
  }
}

export default new InventoryService();


