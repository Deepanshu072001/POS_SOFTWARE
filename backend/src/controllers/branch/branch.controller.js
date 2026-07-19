import branchService from "../../services/branch/branch.service.js";

import serializeBranch from "../../serializers/branch.serializer.js";

import { ApiResponse } from "../../utils/apiResponse.js";

class BranchController {
  async create(req, res, next) {
    try {
      const branch = await branchService.create(
        req.body,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Branch created successfully.",
        serializeBranch(branch),
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const branches = await branchService.findAll();

      return ApiResponse.success(
        res,
        "Branches fetched successfully.",
        branches.map(serializeBranch)
      );
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const branch = await branchService.findById(
        req.params.id
      );

      return ApiResponse.success(
        res,
        "Branch fetched successfully.",
        serializeBranch(branch)
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const branch = await branchService.update(
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
        "Branch updated successfully.",
        serializeBranch(branch)
      );
    } catch (error) {
      next(error);
    }
  }

  async changeStatus(req, res, next) {
    try {
      const branch =
        await branchService.changeStatus(
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
        "Branch status updated successfully.",
        serializeBranch(branch)
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await branchService.delete(
        req.params.id,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Branch deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new BranchController();