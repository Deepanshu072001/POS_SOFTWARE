import supplierRepository from "../../repositories/supplier/supplier.repository.js";

import auditService from "../audit/audit.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";
import generateUniqueCode from "../../helpers/generateUniqueCode.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";
import STATUS from "../../constants/status.js";

import { buildPaginationOptions } from "../../utils/pagination.js";

import AppError from "../../utils/AppError.js";

class SupplierService {
  /*
  |--------------------------------------------------------------------------
  | Validate Create
  |--------------------------------------------------------------------------
  */

  async validateCreate(data) {
    if (
      await supplierRepository.existsByName(
        data.name
      )
    ) {
      throw new AppError(
        "Supplier name already exists.",
        409
      );
    }

    if (
      await supplierRepository.existsByPhone(
        data.phone
      )
    ) {
      throw new AppError(
        "Phone number already exists.",
        409
      );
    }

    if (
      data.email &&
      await supplierRepository.existsByEmail(
        data.email
      )
    ) {
      throw new AppError(
        "Email already exists.",
        409
      );
    }

    if (
      data.gstNumber &&
      await supplierRepository.existsByGST(
        data.gstNumber
      )
    ) {
      throw new AppError(
        "GST number already exists.",
        409
      );
    }

    if (data.code) {
      data.code = data.code.toUpperCase();

      if (
        await supplierRepository.existsByCode(
          data.code
        )
      ) {
        throw new AppError(
          "Supplier code already exists.",
          409
        );
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Build Filters
  |--------------------------------------------------------------------------
  */

  buildFilters(query) {
    const filter = {
      isDeleted: false,
    };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      filter.$or = [
        {
          name: {
            $regex: query.search,
            $options: "i",
          },
        },
        {
          code: {
            $regex: query.search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: query.search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: query.search,
            $options: "i",
          },
        },
      ];
    }

    return filter;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Supplier
  |--------------------------------------------------------------------------
  */

  async create(
    data,
    currentUser,
    requestInfo = {}
  ) {
    await this.validateCreate(data);

    const supplierId =
      await generateBusinessId(
        BUSINESS_IDS.SUPPLIER.name,
        BUSINESS_IDS.SUPPLIER.prefix
      );

    if (!data.code) {
      data.code =
        await generateUniqueCode(
          data.name,
          supplierRepository.existsByCode.bind(
            supplierRepository
          )
        );
    }

    data.code = data.code.toUpperCase();

    data.currentBalance =
      data.openingBalance || 0;

    const supplier =
      await supplierRepository.create({
        ...data,
        supplierId,
        createdBy: currentUser._id,
      });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.SUPPLIER,
      action: AUDIT_ACTIONS.CREATE,
      description: `Supplier ${supplier.supplierId} created.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return supplier;
  }

    /*
  |--------------------------------------------------------------------------
  | Get Suppliers
  |--------------------------------------------------------------------------
  */

  async findAll(query = {}) {
    const options =
      buildPaginationOptions(query);

    const filter =
      this.buildFilters(query);

    return supplierRepository.paginate({
      filter,

      page: options.page,

      limit: options.limit,

      sort: options.sort || {
        name: 1,
      },

      populate: [
        {
          path: "createdBy",
          select:
            "userId firstName lastName",
        },
        {
          path: "updatedBy",
          select:
            "userId firstName lastName",
        },
      ],
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get Supplier By Id
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    const supplier =
      await supplierRepository.findActiveById(
        id
      );

    if (!supplier) {
      throw new AppError(
        "Supplier not found.",
        404
      );
    }

    return supplier.populate([
      {
        path: "createdBy",
        select:
          "userId firstName lastName",
      },
      {
        path: "updatedBy",
        select:
          "userId firstName lastName",
      },
    ]);
  }

    /*
  |--------------------------------------------------------------------------
  | Update Supplier
  |--------------------------------------------------------------------------
  */

  async update(
    id,
    data,
    currentUser,
    requestInfo = {}
  ) {
    const supplier =
      await this.findById(id);

    // Name Validation
    if (
      data.name &&
      data.name !== supplier.name
    ) {
      const exists =
        await supplierRepository.existsByName(
          data.name
        );

      if (exists) {
        throw new AppError(
          "Supplier name already exists.",
          409
        );
      }
    }

    // Phone Validation
    if (
      data.phone &&
      data.phone !== supplier.phone
    ) {
      const exists =
        await supplierRepository.existsByPhone(
          data.phone
        );

      if (exists) {
        throw new AppError(
          "Phone number already exists.",
          409
        );
      }
    }

    // Email Validation
    if (
      data.email &&
      data.email !== supplier.email
    ) {
      const exists =
        await supplierRepository.existsByEmail(
          data.email
        );

      if (exists) {
        throw new AppError(
          "Email already exists.",
          409
        );
      }
    }

    // GST Validation
    if (
      data.gstNumber &&
      data.gstNumber !== supplier.gstNumber
    ) {
      const exists =
        await supplierRepository.existsByGST(
          data.gstNumber
        );

      if (exists) {
        throw new AppError(
          "GST number already exists.",
          409
        );
      }
    }

    // Code Validation
    if (data.code) {
      data.code = data.code.toUpperCase();

      if (
        data.code !== supplier.code
      ) {
        const exists =
          await supplierRepository.existsByCode(
            data.code
          );

        if (exists) {
          throw new AppError(
            "Supplier code already exists.",
            409
          );
        }
      }
    }

    data.updatedBy =
      currentUser._id;

    const updated =
      await supplierRepository.update(
        id,
        data
      );

    await auditService.log({
      user: currentUser._id,

      module: MODULES.SUPPLIER,

      action: AUDIT_ACTIONS.UPDATE,

      description: `Supplier ${updated.supplierId} updated.`,

      ipAddress:
        requestInfo.ipAddress,

      userAgent:
        requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Change Supplier Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(
    id,
    status,
    currentUser,
    requestInfo = {}
  ) {
    if (
      !Object.values(STATUS).includes(
        status
      )
    ) {
      throw new AppError(
        "Invalid status.",
        400
      );
    }

    const supplier =
      await this.findById(id);

    const updated =
      await supplierRepository.updateStatus(
        id,
        status
      );

    await auditService.log({
      user: currentUser._id,

      module: MODULES.SUPPLIER,

      action: AUDIT_ACTIONS.UPDATE,

      description: `Supplier ${supplier.supplierId} status changed to ${status}.`,

      ipAddress:
        requestInfo.ipAddress,

      userAgent:
        requestInfo.userAgent,
    });

    return updated;
  }

    /*
  |--------------------------------------------------------------------------
  | Delete Supplier
  |--------------------------------------------------------------------------
  */

  async delete(
    id,
    currentUser,
    requestInfo = {}
  ) {
    const supplier =
      await this.findById(id);

    await supplierRepository.softDelete(
      id,
      currentUser._id
    );

    await auditService.log({
      user: currentUser._id,

      module: MODULES.SUPPLIER,

      action: AUDIT_ACTIONS.DELETE,

      description: `Supplier ${supplier.supplierId} deleted.`,

      ipAddress:
        requestInfo.ipAddress,

      userAgent:
        requestInfo.userAgent,
    });

    return true;
  }
}

export default new SupplierService();