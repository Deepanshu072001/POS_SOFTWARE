import productRepository from "../../repositories/product/product.repository.js";
import categoryRepository from "../../repositories/category/category.repository.js";
import unitRepository from "../../repositories/unit/unit.repository.js";
import taxRepository from "../../repositories/tax/tax.repository.js";

import auditService from "../audit/audit.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";
import generateUniqueCode from "../../helpers/generateUniqueCode.js";
import generateUniqueSlug from "../../helpers/generateUniqueSlug.js";

import validateReference from "../../helpers/validateReference.js";
import validateBranches from "../../helpers/validateBranches.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";
import STATUS from "../../constants/status.js";

import { buildPaginationOptions } from "../../utils/pagination.js";

import AppError from "../../utils/AppError.js";

class ProductService {
  /*
  |--------------------------------------------------------------------------
  | Validate Relations
  |--------------------------------------------------------------------------
  */

  async validateRelations(data) {
    await validateReference(
      categoryRepository,
      data.category,
      "Category"
    );

    await validateReference(
      unitRepository,
      data.unit,
      "Unit"
    );

    if (data.tax) {
      await validateReference(
        taxRepository,
        data.tax,
        "Tax"
      );
    }

    if (data.branches?.length) {
      await validateBranches(data.branches);
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

    if (query.category) {
      filter.category = query.category;
    }

    if (query.unit) {
      filter.unit = query.unit;
    }

    if (query.tax) {
      filter.tax = query.tax;
    }

    if (query.foodType) {
      filter.foodType = query.foodType;
    }

    if (query.productType) {
      filter.productType = query.productType;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.branch) {
      filter.branches = query.branch;
    }

    if (query.isFeatured !== undefined) {
      filter.isFeatured =
        query.isFeatured === "true";
    }

    if (query.isAvailable !== undefined) {
      filter.isAvailable =
        query.isAvailable === "true";
    }

    return filter;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Product
  |--------------------------------------------------------------------------
  */

  async create(
    data,
    currentUser,
    requestInfo = {}
  ) {
    await this.validateRelations(data);

    if (
      !data.branches ||
      data.branches.length === 0
    ) {
      throw new AppError(
        "At least one branch must be selected.",
        400
      );
    }

    if (!data.code) {
      data.code = await generateUniqueCode(
        data.name,
        productRepository.existsByCode.bind(
          productRepository
        )
      );
    } else {
      data.code = data.code.toUpperCase();

      if (
        await productRepository.existsByCode(
          data.code
        )
      ) {
        throw new AppError(
          "Product code already exists.",
          409
        );
      }
    }

    if (
      await productRepository.existsByName(
        data.name
      )
    ) {
      throw new AppError(
        "Product name already exists.",
        409
      );
    }

    data.slug = await generateUniqueSlug(
      data.name,
      productRepository.existsBySlug.bind(
        productRepository
      )
    );

    const productId =
      await generateBusinessId(
        BUSINESS_IDS.PRODUCT.name,
        BUSINESS_IDS.PRODUCT.prefix
      );

    const product =
      await productRepository.create({
        ...data,
        productId,
        createdBy: currentUser._id,
      });

    await auditService.log({
      user: currentUser._id,
      module: MODULES.PRODUCT,
      action: AUDIT_ACTIONS.CREATE,
      description: `Product ${product.productId} created.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return product;
  }

    /*
  |--------------------------------------------------------------------------
  | Get Products
  |--------------------------------------------------------------------------
  */

  async findAll(query = {}) {
    const options = buildPaginationOptions(query);

    const filter = this.buildFilters(query);

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
          slug: {
            $regex: query.search,
            $options: "i",
          },
        },
      ];
    }

    return productRepository.paginate({
      filter,
      page: options.page,
      limit: options.limit,
      sort: options.sort || {
        displayOrder: 1,
        name: 1,
      },
      populate: [
        {
          path: "category",
          select: "categoryId name code",
        },
        {
          path: "unit",
          select: "unitId name code symbol",
        },
        {
          path: "tax",
          select: "taxId name rate type",
        },
        {
          path: "branches",
          select: "branchId name code",
        },
      ],
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get Product By ID
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    const product =
      await productRepository.findActiveById(id);

    if (!product) {
      throw new AppError(
        "Product not found.",
        404
      );
    }

    return product.populate([
      {
        path: "category",
        select: "categoryId name code",
      },
      {
        path: "unit",
        select: "unitId name code symbol",
      },
      {
        path: "tax",
        select: "taxId name rate type",
      },
      {
        path: "branches",
        select: "branchId name code",
      },
      {
        path: "createdBy",
        select: "userId firstName lastName",
      },
      {
        path: "updatedBy",
        select: "userId firstName lastName",
      },
    ]);
  }

    /*
  |--------------------------------------------------------------------------
  | Update Product
  |--------------------------------------------------------------------------
  */

  async update(
    id,
    data,
    currentUser,
    requestInfo = {}
  ) {
    const product = await this.findById(id);

    await this.validateRelations({
      category: data.category || product.category._id,
      unit: data.unit || product.unit._id,
      tax: data.tax || product.tax?._id,
      branches: data.branches || product.branches,
    });

    // Name Validation
    if (
      data.name &&
      data.name !== product.name
    ) {
      const exists =
        await productRepository.existsByName(
          data.name
        );

      if (exists) {
        throw new AppError(
          "Product name already exists.",
          409
        );
      }

      data.slug =
        await generateUniqueSlug(
          data.name,
          productRepository.existsBySlug.bind(
            productRepository
          )
        );
    }

    // Code Validation
    if (data.code) {
      data.code = data.code.toUpperCase();

      if (data.code !== product.code) {
        const exists =
          await productRepository.existsByCode(
            data.code
          );

        if (exists) {
          throw new AppError(
            "Product code already exists.",
            409
          );
        }
      }
    }

    data.updatedBy = currentUser._id;

    const updated =
      await productRepository.update(id, data);

    await auditService.log({
      user: currentUser._id,
      module: MODULES.PRODUCT,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Product ${updated.productId} updated.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Change Product Status
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

    const product = await this.findById(id);

    const updated =
      await productRepository.updateStatus(
        id,
        status
      );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.PRODUCT,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Product ${product.productId} status changed to ${status}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

    /*
  |--------------------------------------------------------------------------
  | Delete Product
  |--------------------------------------------------------------------------
  */

  async delete(
    id,
    currentUser,
    requestInfo = {}
  ) {
    const product = await this.findById(id);

    await productRepository.softDelete(
      id,
      currentUser._id
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.PRODUCT,
      action: AUDIT_ACTIONS.DELETE,
      description: `Product ${product.productId} deleted.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Search Products
  |--------------------------------------------------------------------------
  */

//   async search(keyword, query = {}) {
//     const options = buildPaginationOptions(query);

//     return productRepository.paginate({
//       filter: {
//         isDeleted: false,
//         $or: [
//           {
//             name: {
//               $regex: keyword,
//               $options: "i",
//             },
//           },
//           {
//             code: {
//               $regex: keyword,
//               $options: "i",
//             },
//           },
//           {
//             slug: {
//               $regex: keyword,
//               $options: "i",
//             },
//           },
//         ],
//       },
//       page: options.page,
//       limit: options.limit,
//       sort: {
//         displayOrder: 1,
//         name: 1,
//       },
//       populate: [
//         {
//           path: "category",
//           select: "categoryId name",
//         },
//         {
//           path: "unit",
//           select: "unitId name symbol",
//         },
//         {
//           path: "tax",
//           select: "taxId name rate",
//         },
//       ],
//     });
//   }
}

export default new ProductService();