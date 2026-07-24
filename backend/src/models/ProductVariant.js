import mongoose from "mongoose";

import STATUS from "../constants/status.js";

const productVariantSchema = new mongoose.Schema(
  {
    variantId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      max_length: 100,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      max_length: 50,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      max_length: 100,
    },

    barcode: {
      type: String,
      default: null,
      trim: true,
      sparse: true,
      unique: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    costPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    profitMargin: {
    type: Number,
    default: 0,
    min: 0
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

    isDefault: {
    type: Boolean,
    default: false,
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

productVariantSchema.index({
  product: 1,
  name: 1,
});

productVariantSchema.index({
  product: 1,
  displayOrder: 1,
});

productVariantSchema.index({
  product: 1,
  status: 1,
});

productVariantSchema.index({
  isDeleted: 1,
});

const ProductVariant = mongoose.model(
  "ProductVariant",
  productVariantSchema
);

export default ProductVariant;