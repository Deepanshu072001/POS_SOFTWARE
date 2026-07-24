import productService from "../../services/product/product.service.js";
import serializeProduct from "../../serializers/product.serializer.js";
import { ApiResponse } from "../../utils/apiResponse.js";

class ProductController {
  /*
  |--------------------------------------------------------------------------
  | Create Product
  |--------------------------------------------------------------------------
  */

  async create(req, res, next) {
    try {
      const product = await productService.create(
        req.body,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Product created successfully.",
        serializeProduct(product),
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Products
  |--------------------------------------------------------------------------
  */

  async findAll(req, res, next) {
    try {
      const result = await productService.findAll(
        req.query
      );

      return ApiResponse.success(
        res,
        "Products fetched successfully.",
        {
          products: result.data.map(serializeProduct),
          pagination: result.pagination,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Product By ID
  |--------------------------------------------------------------------------
  */

  async findById(req, res, next) {
    try {
      const product =
        await productService.findById(
          req.params.id
        );

      return ApiResponse.success(
        res,
        "Product fetched successfully.",
        serializeProduct(product)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Update Product
  |--------------------------------------------------------------------------
  */

  async update(req, res, next) {
    try {
      const product =
        await productService.update(
          req.params.id,
          req.body,
          req.user,
          {
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
          }
        );

      return ApiResponse.success(
        res,
        "Product updated successfully.",
        serializeProduct(product)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Change Product Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(req, res, next) {
    try {
      const product =
        await productService.changeStatus(
          req.params.id,
          req.body.status,
          req.user,
          {
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
          }
        );

      return ApiResponse.success(
        res,
        "Product status updated successfully.",
        serializeProduct(product)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Product
  |--------------------------------------------------------------------------
  */

  async delete(req, res, next) {
    try {
      await productService.delete(
        req.params.id,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Product deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();