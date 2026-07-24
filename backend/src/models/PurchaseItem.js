import mongoose from "mongoose";

import STATUS from "../constants/status.js";

const purchaseItemSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Identity
    |--------------------------------------------------------------------------
    */

    purchaseItemId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
      index: true,
    },

    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Quantities
    |--------------------------------------------------------------------------
    */

    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },

    freeQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    receivedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    // unit: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Unit",
    //     required: true,
    // },

    /*
    |--------------------------------------------------------------------------
    | Pricing
    |--------------------------------------------------------------------------
    */

    unitCost: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Batch Information
    |--------------------------------------------------------------------------
    */

    batchNumber: {
      type: String,
      default: "",
      trim: true,
    },

    manufacturingDate: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | Additional Information
    |--------------------------------------------------------------------------
    */

    remarks: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Audit
    |--------------------------------------------------------------------------
    */

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

purchaseItemSchema.index({
  purchase: 1,
});

purchaseItemSchema.index({
  variant: 1,
});

purchaseItemSchema.index({
  purchase: 1,
  variant: 1,
});

purchaseItemSchema.index({
  batchNumber: 1,
});

purchaseItemSchema.index({
  expiryDate: 1,
});

purchaseItemSchema.index({
  status: 1,
});

purchaseItemSchema.index({
  isDeleted: 1,
});

const PurchaseItem = mongoose.model(
  "PurchaseItem",
  purchaseItemSchema
);

export default PurchaseItem;