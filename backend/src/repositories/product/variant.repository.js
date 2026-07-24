import BaseRepository from "../base/base.repository.js";

import { ProductVariant } from "../../models/index.js";

class VariantRepository extends BaseRepository {
  constructor() {
    super(ProductVariant);
  }

  /*
  |--------------------------------------------------------------------------
  | Finders
  |--------------------------------------------------------------------------
  */

  async findByVariantId(variantId) {
    return this.model.findOne({
      variantId,
      isDeleted: false,
    });
  }

  async findBySku(sku) {
    return this.model.findOne({
      sku: sku.toUpperCase(),
      isDeleted: false,
    });
  }

  async findByBarcode(barcode) {
    return this.model.findOne({
      barcode,
      isDeleted: false,
    });
  }

  async findDefault(productId) {
    return this.model.findOne({
      product: productId,
      isDefault: true,
      isDeleted: false,
    });
  }

  async findByProduct(productId) {
    return this.model
      .find({
        product: productId,
        isDeleted: false,
      })
      .sort({
        displayOrder: 1,
        name: 1,
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Exists
  |--------------------------------------------------------------------------
  */

  async existsByName(productId, name) {
    return this.model.exists({
      product: productId,
      name,
      isDeleted: false,
    });
  }

  async existsByCode(productId, code) {
    return this.model.exists({
      product: productId,
      code: code.toUpperCase(),
      isDeleted: false,
    });
  }

  async existsBySku(sku) {
    return this.model.exists({
      sku: sku.toUpperCase(),
      isDeleted: false,
    });
  }

  async existsByBarcode(barcode) {
    if (!barcode) return false;

    return this.model.exists({
      barcode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Default Variant
  |--------------------------------------------------------------------------
  */

  async clearDefault(productId) {
    return this.model.updateMany(
      {
        product: productId,
      },
      {
        isDefault: false,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id, status) {
    return this.model.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  async search(productId, keyword) {
    return this.model.find({
      product: productId,
      isDeleted: false,
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          sku: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          barcode: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });
  }
}

export default new VariantRepository();