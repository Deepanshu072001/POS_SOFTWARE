import taxRepository from "../../repositories/tax/tax.repository.js";

import auditService from "../audit/audit.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";
import generateCode from "../../helpers/generateCode.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";
import STATUS from "../../constants/status.js";
import TAX_TYPES from "../../constants/taxTypes.js";

import { buildPaginationOptions } from "../../utils/pagination.js";

import AppError from "../../utils/AppError.js";

class TaxService {
  /*
  |--------------------------------------------------------------------------
  | Create Tax
  |--------------------------------------------------------------------------
  */

  async create(data, currentUser, requestInfo = {}) {
    if (!data.code) {
      data.code = generateCode(data.name);
    }

    data.code = data.code.toUpperCase();

    if (await taxRepository.existsByCode(data.code)) {
      throw new AppError("Tax code already exists.", 409);
    }

    if (await taxRepository.existsByName(data.name)) {
      throw new AppError("Tax name already exists.", 409);
    }

    // Validate Tax Rate
    if (
      data.type === TAX_TYPES.PERCENTAGE &&
      (data.rate < 0 || data.rate > 100)
    ) {
      throw new AppError(
        "Percentage tax rate must be between 0 and 100.",
        400
      );
    }

    if (
      data.type === TAX_TYPES.FIXED &&
      data.rate < 0
    ) {
      throw new AppError(
        "Fixed tax rate cannot be negative.",
        400
      );
    }

    // Only one default tax
    if (data.isDefault) {
      await taxRepository.unsetDefault();
    }

    const taxId = await generateBusinessId(
      BUSINESS_IDS.TAX.name,
      BUSINESS_IDS.TAX.prefix
    );

    const tax = await taxRepository.create({
      ...data,
      taxId,
      createdBy: currentUser._id,
    });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.TAX,
      action: AUDIT_ACTIONS.CREATE,
      description: `Tax ${tax.taxId} created.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return tax;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Taxes
  |--------------------------------------------------------------------------
  */

  async findAll(query) {
    const options = buildPaginationOptions(query);

    return taxRepository.paginateActive({
      ...options,
      sort: {
        name: 1,
      },
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get Tax By ID
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    const tax = await taxRepository.findActiveById(id);

    if (!tax) {
      throw new AppError("Tax not found.", 404);
    }

    return tax;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Tax
  |--------------------------------------------------------------------------
  */

  async update(
    id,
    data,
    currentUser,
    requestInfo = {}
  ) {
    const tax = await this.findById(id);

    if (data.name && !data.code) {
      data.code = generateCode(data.name);
    }

    if (
      data.code &&
      data.code.toUpperCase() !== tax.code
    ) {
      if (await taxRepository.existsByCode(data.code)) {
        throw new AppError("Tax code already exists.", 409);
      }

      data.code = data.code.toUpperCase();
    }

    if (
      data.name &&
      data.name !== tax.name
    ) {
      if (await taxRepository.existsByName(data.name)) {
        throw new AppError("Tax name already exists.", 409);
      }
    }

    // Validate Rate
    const type = data.type || tax.type;
    const rate = data.rate ?? tax.rate;

    if (
      type === TAX_TYPES.PERCENTAGE &&
      (rate < 0 || rate > 100)
    ) {
      throw new AppError(
        "Percentage tax rate must be between 0 and 100.",
        400
      );
    }

    if (
      type === TAX_TYPES.FIXED &&
      rate < 0
    ) {
      throw new AppError(
        "Fixed tax rate cannot be negative.",
        400
      );
    }

    // Handle default tax
    if (data.isDefault === true) {
      await taxRepository.unsetDefault();
    }

    data.updatedBy = currentUser._id;

    const updated = await taxRepository.update(
      id,
      data
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.TAX,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Tax ${updated.taxId} updated.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
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
      throw new AppError("Invalid status.", 400);
    }

    const tax = await this.findById(id);

    const updated = await taxRepository.updateStatus(
      id,
      status
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.TAX,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Tax ${tax.taxId} status changed to ${status}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Tax
  |--------------------------------------------------------------------------
  */

  async delete(
    id,
    currentUser,
    requestInfo = {}
  ) {
    const tax = await this.findById(id);

    await taxRepository.softDelete(
      id,
      currentUser._id
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.TAX,
      action: AUDIT_ACTIONS.DELETE,
      description: `Tax ${tax.taxId} deleted.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Search Taxes
  |--------------------------------------------------------------------------
  */

  async search(keyword) {
    return taxRepository.search(keyword);
  }
}

export default new TaxService();