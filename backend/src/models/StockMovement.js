import mongoose from "mongoose";

import STATUS from "../constants/status.js";
import MOVEMENT_TYPES from "../constants/movementTypes.js";
import MOVEMENT_DIRECTIONS from "../constants/movementDirections.js";

const stockMovementSchema = new mongoose.Schema(
  {
    movementId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
      index: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(MOVEMENT_TYPES),
      required: true,
      // index: true,
    },

    direction: {
      type: String,
      enum: Object.values(MOVEMENT_DIRECTIONS),
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },

    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    referenceType: {
      type: String,
      default: null,
      trim: true,
    },

    referenceId: {
      type: String,
      default: null,
      trim: true,
    },

    remarks: {
      type: String,
      default: "",
      max_length: 500,
      trim: true,
    },

    unitCost: {
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

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

stockMovementSchema.index({
  inventory: 1,
  createdAt: -1,
});

stockMovementSchema.index({
  branch: 1,
  variant: 1,
});

stockMovementSchema.index({
  type: 1,
});

stockMovementSchema.index({
  direction: 1,
});

stockMovementSchema.index({
  referenceType: 1,
  referenceId: 1,
});

stockMovementSchema.index({
  status: 1,
});

stockMovementSchema.index({
  isDeleted: 1,
});

const StockMovement = mongoose.model(
  "StockMovement",
  stockMovementSchema
);

export default StockMovement;