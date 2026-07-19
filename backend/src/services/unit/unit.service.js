import unitRepository from "../../repositories/unit/unit.repository.js";

import auditService from "../audit/audit.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";
import generateCode from "../../helpers/generateCode.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";
import STATUS from "../../constants/status.js";

import { buildPaginationOptions } from "../../utils/pagination.js";

import AppError from "../../utils/AppError.js";

class UnitService {
  /*
  |--------------------------------------------------------------------------
  | Create Unit
  |--------------------------------------------------------------------------
  */

  async create(data, currentUser, requestInfo = {}) {
    if (!data.code) {
      data.code = generateCode(data.name);
    }

    data.code = data.code.toUpperCase();

    if (await unitRepository.existsByCode(data.code)) {
      throw new AppError("Unit code already exists.", 409);
    }

    if (await unitRepository.existsByName(data.name)) {
      throw new AppError("Unit name already exists.", 409);
    }

    if (await unitRepository.existsBySymbol(data.symbol)) {
      throw new AppError("Unit symbol already exists.", 409);
    }

    const unitId = await generateBusinessId(
      BUSINESS_IDS.UNIT.name,
      BUSINESS_IDS.UNIT.prefix
    );

    const unit = await unitRepository.create({
      ...data,
      unitId,
      createdBy: currentUser._id,
    });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.UNIT,
      action: AUDIT_ACTIONS.CREATE,
      description: `Unit ${unit.unitId} created.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return unit;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Units
  |--------------------------------------------------------------------------
  */

  async findAll(query) {
    const options = buildPaginationOptions(query);

    return unitRepository.paginateActive({
      ...options,
      sort: {
        name: 1,
      },
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get Unit By Id
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    const unit = await unitRepository.findActiveById(id);

    if (!unit) {
      throw new AppError("Unit not found.", 404);
    }

    return unit;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Unit
  |--------------------------------------------------------------------------
  */

  async update(id, data, currentUser, requestInfo = {}) {
    const unit = await this.findById(id);

    if (data.name && !data.code) {
      data.code = generateCode(data.name);
    }

    if (
      data.code &&
      data.code.toUpperCase() !== unit.code
    ) {
      if (await unitRepository.existsByCode(data.code)) {
        throw new AppError("Unit code already exists.", 409);
      }

      data.code = data.code.toUpperCase();
    }

    if (
      data.name &&
      data.name !== unit.name
    ) {
      if (await unitRepository.existsByName(data.name)) {
        throw new AppError("Unit name already exists.", 409);
      }
    }

    if (
      data.symbol &&
      data.symbol !== unit.symbol
    ) {
      if (await unitRepository.existsBySymbol(data.symbol)) {
        throw new AppError("Unit symbol already exists.", 409);
      }
    }

    data.updatedBy = currentUser._id;

    const updated = await unitRepository.update(id, data);

    await auditService.log({
      user: currentUser._id,
      module: MODULES.UNIT,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Unit ${updated.unitId} updated.`,
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

  async changeStatus(id, status, currentUser, requestInfo = {}) {
    if (!Object.values(STATUS).includes(status)) {
      throw new AppError("Invalid status.", 400);
    }

    const unit = await this.findById(id);

    const updated = await unitRepository.updateStatus(
      id,
      status
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.UNIT,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Unit ${unit.unitId} status changed to ${status}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Unit
  |--------------------------------------------------------------------------
  */

  async delete(id, currentUser, requestInfo = {}) {
    const unit = await this.findById(id);

    await unitRepository.softDelete(
      id,
      currentUser._id
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.UNIT,
      action: AUDIT_ACTIONS.DELETE,
      description: `Unit ${unit.unitId} deleted.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Search Units
  |--------------------------------------------------------------------------
  */

  async search(keyword) {
    return unitRepository.search(keyword);
  }
}

export default new UnitService();