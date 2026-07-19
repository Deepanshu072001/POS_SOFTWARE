import categoryRepository from "../../repositories/category/category.repository.js";

import auditService from "../audit/audit.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";
import generateCode from "../../helpers/generateCode.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";
import STATUS from "../../constants/status.js";

import { buildPaginationOptions } from "../../utils/pagination.js";

import AppError from "../../utils/AppError.js";

class CategoryService {
  /*
  |--------------------------------------------------------------------------
  | Create Category
  |--------------------------------------------------------------------------
  */

  async create(data, currentUser, requestInfo = {}) {
    if (!data.code) {
      data.code = generateCode(data.name);
    }

    data.code = data.code.toUpperCase();

    const codeExists = await categoryRepository.existsByCode(data.code);

    if (codeExists) {
      throw new AppError("Category code already exists.", 409);
    }

    const nameExists = await categoryRepository.existsByName(data.name);

    if (nameExists) {
      throw new AppError("Category name already exists.", 409);
    }

    const categoryId = await generateBusinessId(
      BUSINESS_IDS.CATEGORY.name,
      BUSINESS_IDS.CATEGORY.prefix
    );

    const category = await categoryRepository.create({
      ...data,
      categoryId,
      createdBy: currentUser._id,
    });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.CATEGORY,
      action: AUDIT_ACTIONS.CREATE,
      description: `Category ${category.categoryId} created.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return category;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Categories
  |--------------------------------------------------------------------------
  */

  async findAll(query) {
    const options = buildPaginationOptions(query);

    return categoryRepository.paginateActive({
      ...options,
      sort: {
        displayOrder: 1,
        name: 1,
      },
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get Category By Id
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    const category =
      await categoryRepository.findActiveById(id);

    if (!category) {
      throw new AppError("Category not found.", 404);
    }

    return category;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Category
  |--------------------------------------------------------------------------
  */

  async update(
    id,
    data,
    currentUser,
    requestInfo = {}
  ) {
    const category = await this.findById(id);

    if (data.name && !data.code) {
      data.code = generateCode(data.name);
    }

    if (
      data.code &&
      data.code.toUpperCase() !== category.code
    ) {
      const exists =
        await categoryRepository.existsByCode(
          data.code
        );

      if (exists) {
        throw new AppError(
          "Category code already exists.",
          409
        );
      }

      data.code = data.code.toUpperCase();
    }

    if (
      data.name &&
      data.name !== category.name
    ) {
      const exists =
        await categoryRepository.existsByName(
          data.name
        );

      if (exists) {
        throw new AppError(
          "Category name already exists.",
          409
        );
      }
    }

    data.updatedBy = currentUser._id;

    const updated =
      await categoryRepository.update(id, data);

    await auditService.log({
      user: currentUser._id,
      module: MODULES.CATEGORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Category ${updated.categoryId} updated.`,
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

    const category = await this.findById(id);

    const updated =
      await categoryRepository.updateStatus(
        id,
        status
      );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.CATEGORY,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Category ${category.categoryId} status changed to ${status}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Category
  |--------------------------------------------------------------------------
  */

  async delete(
    id,
    currentUser,
    requestInfo = {}
  ) {
    const category = await this.findById(id);

    await categoryRepository.softDelete(
      id,
      currentUser._id
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.CATEGORY,
      action: AUDIT_ACTIONS.DELETE,
      description: `Category ${category.categoryId} deleted.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Search Categories
  |--------------------------------------------------------------------------
  */

  async search(keyword) {
    return categoryRepository.search(keyword);
  }
}

export default new CategoryService();