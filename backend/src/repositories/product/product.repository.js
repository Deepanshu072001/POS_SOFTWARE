import BaseRepository from "../base/base.repository.js";

import { Product } from "../../models/index.js";

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  /*
  |--------------------------------------------------------------------------
  | Finders
  |--------------------------------------------------------------------------
  */

  async findByProductId(productId) {
    return this.model.findOne({
      productId,
      isDeleted: false,
    });
  }

  async findByCode(code) {
    return this.model.findOne({
      code: code.toUpperCase(),
      isDeleted: false,
    });
  }

  async findBySlug(slug) {
    return this.model.findOne({
      slug: slug.toLowerCase(),
      isDeleted: false,
    });
  }

  async findByName(name) {
    return this.model.findOne({
      name,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Exists
  |--------------------------------------------------------------------------
  */

  async existsByCode(code) {
    return this.model.exists({
      code: code.toUpperCase(),
      isDeleted: false,
    });
  }

  async existsBySlug(slug) {
    return this.model.exists({
      slug: slug.toLowerCase(),
      isDeleted: false,
    });
  }

  async existsByName(name) {
    return this.model.exists({
      name,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  async findByCategory(categoryId) {
    return this.model.find({
      category: categoryId,
      isDeleted: false,
    });
  }

  async findByBranch(branchId) {
    return this.model.find({
      branches: branchId,
      isDeleted: false,
    });
  }

  async findFeatured() {
    return this.model.find({
      isFeatured: true,
      status: "ACTIVE",
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  async search(keyword) {
    return this.paginateActive({
      filter: {
        $or: [
          {
            name: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            code: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            slug: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            description: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      },
    });
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
}

export default new ProductRepository();