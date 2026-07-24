import mongoose from "mongoose";

import STATUS from "../constants/status.js";
import FOOD_TYPES from "../constants/foodTypes.js";
import PRODUCT_TYPES from "../constants/productTypes.js";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      max_length: 150,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      max_length: 50,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
      max_length: 300,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      max_length: 2000,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },

    tax: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tax",
      default: null,
    },

    foodType: {
      type: String,
      enum: Object.values(FOOD_TYPES),
      default: FOOD_TYPES.VEG,
    },

    productType: {
      type: String,
      enum: Object.values(PRODUCT_TYPES),
      default: PRODUCT_TYPES.SIMPLE,
    },

    hasVariants: {
      type: Boolean,
      default: false,
    },

    hasAddons: {
      type: Boolean,
      default: false,
    },

    trackInventory: {
      type: Boolean,
      default: true,
    },

    allowNegativeStock: {
      type: Boolean,
      default: false,
    },

    preparationTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    gallery: [
      {
        type: String,
        trim: true,
      },
    ],

    branches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],

    defaultVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },

    displayOrder: {
        type: Number,
        default: 0,
        min: 0,
    },
    
    isAvailable: {
        type: Boolean,
        default: true,
    },

    isFeatured: {
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

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

productSchema.index({ name: 1 });
// productSchema.index({ productId: 1 });
// productSchema.index({ code: 1 });
//productSchema.index({ slug: 1 });

productSchema.index({ category: 1 });
productSchema.index({ unit: 1 });
productSchema.index({ tax: 1 });

productSchema.index({ foodType: 1 });
productSchema.index({ productType: 1 });

productSchema.index({ displayOrder: 1 });

productSchema.index({ isAvailable: 1 });

productSchema.index({ isFeatured: 1 });

productSchema.index({ status: 1 });

productSchema.index({ isDeleted: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;