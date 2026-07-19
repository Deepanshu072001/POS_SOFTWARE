import mongoose from "mongoose";

import STATUS from "../constants/status.js";

const unitSchema = new mongoose.Schema(
  {
    unitId: {
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

    symbol: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
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

unitSchema.index({ name: 1 });
unitSchema.index({ code: 1 });
unitSchema.index({ symbol: 1 });
unitSchema.index({ status: 1 });
unitSchema.index({ isDeleted: 1 });

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;