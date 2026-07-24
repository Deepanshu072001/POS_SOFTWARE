import purchaseService from "../../services/purchase/purchase.service.js";
import purchaseApprovalService from "../../services/purchase/purchaseApproval.service.js";

import serializePurchase from "../../serializers/purchase.serializer.js";
import { ApiResponse } from "../../utils/apiResponse.js";

class PurchaseController {
  /*
  |--------------------------------------------------------------------------
  | Create Purchase
  |--------------------------------------------------------------------------
  */

  async create(req, res, next) {
    try {
      const purchase = await purchaseService.create(
        req.body,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Purchase created successfully.",
        serializePurchase(purchase),
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Purchases
  |--------------------------------------------------------------------------
  */

  async findAll(req, res, next) {
    try {
      const result = await purchaseService.findAll(req.query);

      return ApiResponse.success(
        res,
        "Purchases fetched successfully.",
        {
          purchases: result.data.map(serializePurchase),
          pagination: result.pagination,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Purchase By ID
  |--------------------------------------------------------------------------
  */

  async findById(req, res, next) {
    try {
      const purchase = await purchaseService.findById(
        req.params.id
      );

      return ApiResponse.success(
        res,
        "Purchase fetched successfully.",
        serializePurchase(purchase)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Update Purchase
  |--------------------------------------------------------------------------
  */

  async update(req, res, next) {
    try {
      const purchase = await purchaseService.update(
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
        "Purchase updated successfully.",
        serializePurchase(purchase)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Purchase
  |--------------------------------------------------------------------------
  */

  async delete(req, res, next) {
    try {
      await purchaseService.delete(
        req.params.id,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Purchase deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Approve Purchase
  |--------------------------------------------------------------------------
  */

  async approve(req, res, next) {
    try {
      const purchase =
        await purchaseApprovalService.approve(
          req.params.id,
          req.user,
          {
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
          }
        );

      return ApiResponse.success(
        res,
        "Purchase approved successfully.",
        serializePurchase(purchase)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Receive Purchase
  |--------------------------------------------------------------------------
  */

  async receive(req, res, next) {
    try {
      const purchase =
        await purchaseApprovalService.receive(
          req.params.id,
          req.user,
          {
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
          }
        );

      return ApiResponse.success(
        res,
        "Purchase received successfully.",
        serializePurchase(purchase)
      );
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Cancel Purchase
  |--------------------------------------------------------------------------
  */

  async cancel(req, res, next) {
    try {
      const purchase =
        await purchaseApprovalService.cancel(
          req.params.id,
          req.user,
          {
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
          }
        );

      return ApiResponse.success(
        res,
        "Purchase cancelled successfully.",
        serializePurchase(purchase)
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new PurchaseController();