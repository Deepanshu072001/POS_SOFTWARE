import variantService from "../../services/product/variant.service.js";
import serializeVariant from "../../serializers/variant.serializer.js";
import { ApiResponse } from "../../utils/apiResponse.js";

class VariantController {
  /*
  |--------------------------------------------------------------------------
  | Create Variant
  |--------------------------------------------------------------------------
  */

  async create(req, res, next) {
    try {
      const variant = await variantService.create(
        req.body,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Variant created successfully.",
        serializeVariant(variant),
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Variants By Product
  |--------------------------------------------------------------------------
  */

  async findAll(req, res, next) {
    try {
      const variants = await variantService.findAll(
        req.params.productId
      );

      return ApiResponse.success(
        res,
        "Variants fetched successfully.",
        variants.map(serializeVariant)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Variant By Id
  |--------------------------------------------------------------------------
  */

  async findById(req, res, next) {
    try {
      const variant = await variantService.findById(
        req.params.id
      );

      return ApiResponse.success(
        res,
        "Variant fetched successfully.",
        serializeVariant(variant)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Update Variant
  |--------------------------------------------------------------------------
  */

  async update(req, res, next) {
    try {
      const variant = await variantService.update(
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
        "Variant updated successfully.",
        serializeVariant(variant)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Change Variant Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(req, res, next) {
    try {
      const variant =
        await variantService.changeStatus(
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
        "Variant status updated successfully.",
        serializeVariant(variant)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Variant
  |--------------------------------------------------------------------------
  */

  async delete(req, res, next) {
    try {
      await variantService.delete(
        req.params.id,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Variant deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new VariantController();