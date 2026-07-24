import mongoose from "mongoose";

import STATUS from "../constants/status.js";

const TAX_TYPES = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
};

const taxSchema = new mongoose.Schema(
  {
    taxId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 20,
      default: null,
    },

    type: {
      type: String,
      enum: Object.values(TAX_TYPES),
      default: TAX_TYPES.PERCENTAGE,
    },

    rate: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    isDefault: {
      type: Boolean,
      default: false,
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

taxSchema.index({ name: 1 });
// taxSchema.index({ code: 1 });
taxSchema.index({ type: 1 });
taxSchema.index({ status: 1 });
taxSchema.index({ isDeleted: 1 });

const Tax = mongoose.model("Tax", taxSchema);

export { TAX_TYPES };

export default Tax;