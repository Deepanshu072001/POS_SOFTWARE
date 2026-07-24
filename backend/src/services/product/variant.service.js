import variantRepository from "../../repositories/product/variant.repository.js";
import productRepository from "../../repositories/product/product.repository.js";

import auditService from "../audit/audit.service.js";
import inventoryService from "../inventory/inventory.service.js";

import generateBusinessId from "../../helpers/generateBusinessId.js";
import generateUniqueCode from "../../helpers/generateUniqueCode.js";

import BUSINESS_IDS from "../../constants/businessIds.js";
import MODULES from "../../constants/modules.js";
import AUDIT_ACTIONS from "../../constants/auditActions.js";
import STATUS from "../../constants/status.js";

import AppError from "../../utils/AppError.js";

class VariantService {
  /*
  |--------------------------------------------------------------------------
  | Validate Product
  |--------------------------------------------------------------------------
  */

  async validateProduct(productId) {
    const product =
      await productRepository.findActiveById(
        productId
      );

    if (!product) {
      throw new AppError(
        "Product not found.",
        404
      );
    }

    return product;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Variant
  |--------------------------------------------------------------------------
  */

  async create(
    data,
    currentUser,
    requestInfo = {}
  ) {
    const product =
      await this.validateProduct(data.product);

    if (
      await variantRepository.existsByName(
        data.product,
        data.name
      )
    ) {
      throw new AppError(
        "Variant name already exists.",
        409
      );
    }

    if (!data.code) {
      data.code =
        await generateUniqueCode(
          data.name,
          async (code) =>
            variantRepository.existsByCode(
              data.product,
              code
            )
        );
    } else {
      data.code = data.code.toUpperCase();

      if (
        await variantRepository.existsByCode(
          data.product,
          data.code
        )
      ) {
        throw new AppError(
          "Variant code already exists.",
          409
        );
      }
    }

    if (
      await variantRepository.existsBySku(
        data.sku
      )
    ) {
      throw new AppError(
        "SKU already exists.",
        409
      );
    }

    if (
      data.barcode &&
      await variantRepository.existsByBarcode(
        data.barcode
      )
    ) {
      throw new AppError(
        "Barcode already exists.",
        409
      );
    }

    if (data.isDefault) {
      await variantRepository.clearDefault(
        data.product
      );
    }

    const variantId =
      await generateBusinessId(
        BUSINESS_IDS.VARIANT.name,
        BUSINESS_IDS.VARIANT.prefix
      );

    const variant =
      await variantRepository.create({
        ...data,
        variantId,
        createdBy: currentUser._id,
      });

    const defaultVariant =
  await variantRepository.findDefault(
    data.product
  );

if (!defaultVariant) {
  await variantRepository.update(
    variant._id,
    {
      isDefault: true,
    }
  );

  await productRepository.update(
    product._id,
    {
      defaultVariant: variant._id,
    }
  );
} else if (variant.isDefault) {
  await productRepository.update(
    product._id,
    {
      defaultVariant: variant._id,
    }
  );
}

await inventoryService.createMissingInventories(
  currentUser
);

    await auditService.log({
      user: currentUser._id,
      module: MODULES.PRODUCT,
      action: AUDIT_ACTIONS.CREATE,
      description: `Variant ${variant.variantId} created for Product ${product.productId}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return variant;
  }

    /*
  |--------------------------------------------------------------------------
  | Get Variants
  |--------------------------------------------------------------------------
  */

  async findAll(productId) {
    await this.validateProduct(productId);

    return variantRepository.findByProduct(productId);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Variant By ID
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    const variant =
      await variantRepository
        .findActiveById(id)
        .populate([
          {
            path: "product",
            select:
              "productId name code defaultVariant",
          },
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

    if (!variant) {
      throw new AppError(
        "Variant not found.",
        404
      );
    }

    return variant;
}

    /*
  |--------------------------------------------------------------------------
  | Update Variant
  |--------------------------------------------------------------------------
  */

  async update(
    id,
    data,
    currentUser,
    requestInfo = {}
  ) {
    const variant = await this.findById(id);

    if (
      data.name &&
      data.name !== variant.name
    ) {
      const exists =
        await variantRepository.existsByName(
          variant.product._id,
          data.name
        );

      if (exists) {
        throw new AppError(
          "Variant name already exists.",
          409
        );
      }
    }

    if (data.code) {
      data.code = data.code.toUpperCase();

      if (data.code !== variant.code) {
        const exists =
          await variantRepository.existsByCode(
            variant.product._id,
            data.code
          );

        if (exists) {
          throw new AppError(
            "Variant code already exists.",
            409
          );
        }
      }
    }

    if (
      data.sku &&
      data.sku.toUpperCase() !== variant.sku
    ) {
      const exists =
        await variantRepository.existsBySku(
          data.sku
        );

      if (exists) {
        throw new AppError(
          "SKU already exists.",
          409
        );
      }

      data.sku = data.sku.toUpperCase();
    }

    if (
      data.barcode &&
      data.barcode !== variant.barcode
    ) {
      const exists =
        await variantRepository.existsByBarcode(
          data.barcode
        );

      if (exists) {
        throw new AppError(
          "Barcode already exists.",
          409
        );
      }
    }

    if (data.isDefault) {
      await variantRepository.clearDefault(
        variant.product._id
      );
    }

    data.updatedBy = currentUser._id;

    const updated =
      await variantRepository.update(
        id,
        data
      );

    if (updated.isDefault) {
      await productRepository.update(
        variant.product._id,
        {
          defaultVariant: updated._id,
        }
      );
    }

    await auditService.log({
      user: currentUser._id,
      module: MODULES.PRODUCT,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Variant ${updated.variantId} updated.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Change Variant Status
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

    const variant = await this.findById(id);

    const updated =
      await variantRepository.updateStatus(
        id,
        status
      );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.PRODUCT,
      action: AUDIT_ACTIONS.UPDATE,
      description: `Variant ${variant.variantId} status changed to ${status}.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return updated;
  }

    /*
  |--------------------------------------------------------------------------
  | Delete Variant
  |--------------------------------------------------------------------------
  */

  async delete(
    id,
    currentUser,
    requestInfo = {}
  ) {
    const variant = await this.findById(id);

    const variants =
  await variantRepository.findByProduct(
    variant.product._id
  );

if (variants.length === 1) {
  throw new AppError(
    "Product must have at least one variant.",
    400
  );
}

    await variantRepository.softDelete(
      id,
      currentUser._id
    );

    await auditService.log({
      user: currentUser._id,
      module: MODULES.PRODUCT,
      action: AUDIT_ACTIONS.DELETE,
      description: `Variant ${variant.variantId} deleted.`,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent,
    });

    return true;
  }
}

export default new VariantService();
