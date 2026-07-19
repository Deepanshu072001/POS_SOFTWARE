import mongoose from "mongoose";

import STATUS from "../constants/status.js";

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      max_length: 100,
    },

    code: {
        type: String,
        unique: true,
        uppercase: true,
        trim: true,
        max_length: 20,
        default: null,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      max_length: 500,
    },

    image: {
      type: String,
      default: null,
    },

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categorySchema.index({ name: 1 });
categorySchema.index({ code: 1 });
categorySchema.index({ status: 1 });
categorySchema.index({ isDeleted: 1 });
categorySchema.index({ displayOrder: 1 });

const Category = mongoose.model(
  "Category",
  categorySchema
);

export default Category;