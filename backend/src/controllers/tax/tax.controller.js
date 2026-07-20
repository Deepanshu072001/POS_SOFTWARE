import taxService from "../../services/tax/tax.service.js";
import serializeTax from "../../serializers/tax.serializer.js";
import { ApiResponse } from "../../utils/apiResponse.js";

class TaxController {
  /*
  |--------------------------------------------------------------------------
  | Create Tax
  |--------------------------------------------------------------------------
  */

  async create(req, res, next) {
    try {
      const tax = await taxService.create(
        req.body,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Tax created successfully.",
        serializeTax(tax),
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Taxes
  |--------------------------------------------------------------------------
  */

  async findAll(req, res, next) {
    try {
      const result = await taxService.findAll(req.query);

      return ApiResponse.success(
        res,
        "Taxes fetched successfully.",
        {
          taxes: result.data.map(serializeTax),
          pagination: result.pagination,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Tax By ID
  |--------------------------------------------------------------------------
  */

  async findById(req, res, next) {
    try {
      const tax = await taxService.findById(req.params.id);

      return ApiResponse.success(
        res,
        "Tax fetched successfully.",
        serializeTax(tax)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Update Tax
  |--------------------------------------------------------------------------
  */

  async update(req, res, next) {
    try {
      const tax = await taxService.update(
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
        "Tax updated successfully.",
        serializeTax(tax)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Change Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(req, res, next) {
    try {
      const tax = await taxService.changeStatus(
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
        "Tax status updated successfully.",
        serializeTax(tax)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Tax
  |--------------------------------------------------------------------------
  */

  async delete(req, res, next) {
    try {
      await taxService.delete(
        req.params.id,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Tax deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new TaxController();