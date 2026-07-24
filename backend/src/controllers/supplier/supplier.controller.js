import supplierService from "../../services/supplier/supplier.service.js";
import serializeSupplier from "../../serializers/supplier.serializer.js";
import { ApiResponse } from "../../utils/apiResponse.js";

class SupplierController {
  /*
  |--------------------------------------------------------------------------
  | Create Supplier
  |--------------------------------------------------------------------------
  */

  async create(req, res, next) {
    try {
      const supplier = await supplierService.create(
        req.body,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Supplier created successfully.",
        serializeSupplier(supplier),
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Suppliers
  |--------------------------------------------------------------------------
  */

  async findAll(req, res, next) {
    try {
      const result = await supplierService.findAll(
        req.query
      );

      return ApiResponse.success(
        res,
        "Suppliers fetched successfully.",
        {
          suppliers: result.data.map(
            serializeSupplier
          ),
          pagination: result.pagination,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Supplier By ID
  |--------------------------------------------------------------------------
  */

  async findById(req, res, next) {
    try {
      const supplier =
        await supplierService.findById(
          req.params.id
        );

      return ApiResponse.success(
        res,
        "Supplier fetched successfully.",
        serializeSupplier(supplier)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Update Supplier
  |--------------------------------------------------------------------------
  */

  async update(req, res, next) {
    try {
      const supplier =
        await supplierService.update(
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
        "Supplier updated successfully.",
        serializeSupplier(supplier)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Change Supplier Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(req, res, next) {
    try {
      const supplier =
        await supplierService.changeStatus(
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
        "Supplier status updated successfully.",
        serializeSupplier(supplier)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Supplier
  |--------------------------------------------------------------------------
  */

  async delete(req, res, next) {
    try {
      await supplierService.delete(
        req.params.id,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Supplier deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new SupplierController();