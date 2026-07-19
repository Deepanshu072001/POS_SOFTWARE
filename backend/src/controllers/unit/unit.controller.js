import unitService from "../../services/unit/unit.service.js";
import serializeUnit from "../../serializers/unit.serializer.js";
import { ApiResponse } from "../../utils/apiResponse.js";

class UnitController {
  /*
  |--------------------------------------------------------------------------
  | Create Unit
  |--------------------------------------------------------------------------
  */

  async create(req, res, next) {
    try {
      const unit = await unitService.create(
        req.body,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Unit created successfully.",
        serializeUnit(unit),
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Units
  |--------------------------------------------------------------------------
  */

  async findAll(req, res, next) {
    try {
      const result = await unitService.findAll(req.query);

      return ApiResponse.success(
        res,
        "Units fetched successfully.",
        {
          units: result.data.map(serializeUnit),
          pagination: result.pagination,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Unit By ID
  |--------------------------------------------------------------------------
  */

  async findById(req, res, next) {
    try {
      const unit = await unitService.findById(req.params.id);

      return ApiResponse.success(
        res,
        "Unit fetched successfully.",
        serializeUnit(unit)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Update Unit
  |--------------------------------------------------------------------------
  */

  async update(req, res, next) {
    try {
      const unit = await unitService.update(
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
        "Unit updated successfully.",
        serializeUnit(unit)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Change Unit Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(req, res, next) {
    try {
      const unit = await unitService.changeStatus(
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
        "Unit status updated successfully.",
        serializeUnit(unit)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Unit
  |--------------------------------------------------------------------------
  */

  async delete(req, res, next) {
    try {
      await unitService.delete(
        req.params.id,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Unit deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UnitController();