import branchRepository from "../../repositories/branch/branch.repository.js";

import auditService from "../audit/audit.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";
import STATUS from "../../constants/status.js";

import AppError from "../../utils/AppError.js";

class BranchService {
  /*
  |--------------------------------------------------------------------------
  | Create Branch
  |--------------------------------------------------------------------------
  */

  async create(data, currentUser, requestInfo = {}) {
    const code = data.code.toUpperCase();

    const codeExists = await branchRepository.existsByCode(code);

    if (codeExists) {
      throw new AppError("Branch code already exists.", 409);
    }

    const nameExists = await branchRepository.existsByName(data.name);

    if (nameExists) {
      throw new AppError("Branch name already exists.", 409);
    }

    const branchId = await generateBusinessId(
      BUSINESS_IDS.BRANCH.name,
      BUSINESS_IDS.BRANCH.prefix
    );

    const branch = await branchRepository.create({
      ...data,
      branchId,
      code,
      createdBy: currentUser._id,
    });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.BRANCH,
      action: AUDIT_ACTIONS.CREATE,
      description: `Branch ${branch.branchId} created.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return branch;
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Branches
  |--------------------------------------------------------------------------
  */

  async findAll() {
    return branchRepository.find({
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get Branch By Id
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    const branch = await branchRepository.findById(id);

    if (!branch || branch.isDeleted) {
      throw new AppError("Branch not found.", 404);
    }

    return branch;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Branch
  |--------------------------------------------------------------------------
  */

  async update(id, data, currentUser, requestInfo = {}) {
    const branch = await this.findById(id);

    if (
      data.code &&
      data.code.toUpperCase() !== branch.code
    ) {
      const exists = await branchRepository.existsByCode(
        data.code
      );

      if (exists) {
        throw new AppError(
          "Branch code already exists.",
          409
        );
      }

      data.code = data.code.toUpperCase();
    }

    if (
      data.name &&
      data.name !== branch.name
    ) {
      const exists = await branchRepository.existsByName(
        data.name
      );

      if (exists) {
        throw new AppError(
          "Branch name already exists.",
          409
        );
      }
    }

    data.updatedBy = currentUser._id;

    const updated = await branchRepository.update(
      id,
      data
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.BRANCH,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Branch ${updated.branchId} updated.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Branch
  |--------------------------------------------------------------------------
  */

  async delete(id, currentUser, requestInfo = {}) {
    const branch = await this.findById(id);

    await branchRepository.update(id, {
      isDeleted: true,
      updatedBy: currentUser._id,
    });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.BRANCH,
      action: AUDIT_ACTIONS.DELETE,
      description: `Branch ${branch.branchId} deleted.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return true;
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
    const branch = await this.findById(id);

    if (!Object.values(STATUS).includes(status)) {
      throw new AppError("Invalid status.", 400);
    }

    const updated =
      await branchRepository.updateStatus(
        id,
        status
      );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.BRANCH,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Branch ${branch.branchId} status changed to ${status}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Search Branch
  |--------------------------------------------------------------------------
  */

  async search(keyword) {
    return branchRepository.search(keyword);
  }
}

export default new BranchService();