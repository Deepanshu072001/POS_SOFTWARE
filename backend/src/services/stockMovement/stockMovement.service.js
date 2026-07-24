import stockMovementRepository from "../../repositories/stockMovement/stockMovement.repository.js";
import inventoryRepository from "../../repositories/inventory/inventory.repository.js";

import inventoryService from "../inventory/inventory.service.js";
import auditService from "../audit/audit.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";
import MOVEMENT_DIRECTIONS from "../../constants/movementDirections.js";
import STATUS from "../../constants/status.js";

import AppError from "../../utils/AppError.js";

class StockMovementService {
  /*
  |--------------------------------------------------------------------------
  | Validate Inventory
  |--------------------------------------------------------------------------
  */

  async validateInventory(inventoryId) {
    const inventory =
      await inventoryRepository.findWithRelations(
        inventoryId
      );

    if (!inventory) {
      throw new AppError(
        "Inventory not found.",
        404
      );
    }

    return inventory;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Stock Movement
  |--------------------------------------------------------------------------
  */

  async create(
    data,
    currentUser,
    requestInfo = {}
  ) {
    const inventory =
      await this.validateInventory(
        data.inventory
      );

    const balanceBefore =
      inventory.currentStock;

    let balanceAfter = balanceBefore;

    if (
      data.direction ===
      MOVEMENT_DIRECTIONS.IN
    ) {
      balanceAfter =
        balanceBefore + data.quantity;
    } else {
      if (
        inventory.availableStock <
        data.quantity
      ) {
        throw new AppError(
          "Insufficient stock.",
          400
        );
      }

      balanceAfter =
        balanceBefore - data.quantity;
    }

    const movementId =
      await generateBusinessId(
        BUSINESS_IDS.STOCK_MOVEMENT.name,
        BUSINESS_IDS.STOCK_MOVEMENT.prefix
      );

    const movement =
      await stockMovementRepository.create({
        ...data,
        movementId,

        branch: inventory.branch._id,

        variant: inventory.variant._id,

        balanceBefore,

        balanceAfter,

        createdBy: currentUser._id,
      });

    if (
      data.direction ===
      MOVEMENT_DIRECTIONS.IN
    ) {
      await inventoryService.increaseStock(
        inventory._id,
        data.quantity,
        currentUser,
        requestInfo
      );
    } else {
      await inventoryService.decreaseStock(
        inventory._id,
        data.quantity,
        currentUser,
        requestInfo
      );
}

    await auditService.log({
      user: currentUser._id,

      module: MODULES.INVENTORY,

      action: AUDIT_ACTIONS.UPDATE,

      description: `Stock Movement ${movement.movementId} created.`,

      ipAddress: requestInfo.ipAddress,

      userAgent: requestInfo.userAgent,
    });

    return movement;
  }

    /*
  |--------------------------------------------------------------------------
  | Get Stock Movements
  |--------------------------------------------------------------------------
  */

  async findAll(query = {}) {
    const filter = {
      isDeleted: false,
    };

    if (query.inventory) {
      filter.inventory = query.inventory;
    }

    if (query.branch) {
      filter.branch = query.branch;
    }

    if (query.variant) {
      filter.variant = query.variant;
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.direction) {
      filter.direction = query.direction;
    }

    if (query.referenceType) {
      filter.referenceType = query.referenceType;
    }

    if (query.referenceId) {
      filter.referenceId = query.referenceId;
    }

    if (query.status) {
      filter.status = query.status;
    }

    return stockMovementRepository.paginate({
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
        {
          path: "inventory",
          select:
            "inventoryId currentStock availableStock",
        },
      ],
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get Stock Movement By Id
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    const movement =
      await stockMovementRepository
        .findWithRelations(id);
        // .populate([
        //   {
        //     path: "branch",
        //     select: "branchId name code",
        //   },
        //   {
        //     path: "variant",
        //     populate: {
        //       path: "product",
        //       select: "productId name code",
        //     },
        //   },
        //   {
        //     path: "inventory",
        //     select:
        //       "inventoryId currentStock availableStock",
        //   },
        //   {
        //     path: "createdBy",
        //     select:
        //       "userId firstName lastName",
        //   },
        // ]);

    if (!movement || movement.isDeleted) {
      throw new AppError(
        "Stock movement not found.",
        404
      );
    }

    return movement;
  }

    /*
  |--------------------------------------------------------------------------
  | Change Status
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

    const movement = await this.findById(id);

    const updated =
      await stockMovementRepository.updateStatus(
        id,
        status
      );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.INVENTORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Stock Movement ${movement.movementId} status changed to ${status}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Stock Movement
  |--------------------------------------------------------------------------
  */

async delete() {
  throw new AppError(
    "Stock movements cannot be deleted. Create a reverse adjustment instead.",
    400
  );
}
  /*
  |--------------------------------------------------------------------------
  | Reports
  |--------------------------------------------------------------------------
  */

  async findByReference(
    referenceType,
    referenceId
  ) {
    return stockMovementRepository.findByReference(
      referenceType,
      referenceId
    );
  }

  async findByDateRange(from, to) {
    return stockMovementRepository.findByDateRange(
      from,
      to
    );
  }

  async findStockIn() {
    return stockMovementRepository.findStockIn();
  }

  async findStockOut() {
    return stockMovementRepository.findStockOut();
  }

  async findLatestMovement(inventoryId) {
    return stockMovementRepository.findLatestMovement(
      inventoryId
    );
  }

}

export default new StockMovementService();