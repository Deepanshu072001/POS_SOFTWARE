import categoryService from "../../services/category/category.service.js";
import serializeCategory from "../../serializers/category/category.serializer.js";
import { ApiResponse } from "../../utils/apiResponse.js";

class CategoryController {
  async create(req, res, next) {
    try {
      const category = await categoryService.create(
        req.body,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Category created successfully.",
        serializeCategory(category),
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const result = await categoryService.findAll(req.query);

      return ApiResponse.success(
        res,
        "Categories fetched successfully.",
        {
          categories: result.data.map(serializeCategory),
          pagination: result.pagination,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const category = await categoryService.findById(req.params.id);

      return ApiResponse.success(
        res,
        "Category fetched successfully.",
        serializeCategory(category)
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const category = await categoryService.update(
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
        "Category updated successfully.",
        serializeCategory(category)
      );
    } catch (error) {
      next(error);
    }
  }

  async changeStatus(req, res, next) {
    try {
      const category = await categoryService.changeStatus(
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
        "Category status updated successfully.",
        serializeCategory(category)
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await categoryService.delete(
        req.params.id,
        req.user,
        {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return ApiResponse.success(
        res,
        "Category deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();