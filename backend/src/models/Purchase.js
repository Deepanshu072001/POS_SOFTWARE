import mongoose from "mongoose";

import STATUS from "../constants/status.js";
import PURCHASE_STATUS from "../constants/purchaseStatus.js";
import PAYMENT_STATUS from "../constants/paymentStatus.js";
import PURCHASE_TYPES from "../constants/purchaseTypes.js";

const purchaseSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    purchaseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
      index: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    invoiceNumber: {
      type: String,
      default: "",
      trim: true,
    },

    invoiceDate: {
      type: Date,
      required: true,
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    purchaseType: {
      type: String,
      enum: Object.values(PURCHASE_TYPES),
      default: PURCHASE_TYPES.LOCAL,
    },

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    roundOff: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },

    purchaseStatus: {
      type: String,
      enum: Object.values(PURCHASE_STATUS),
      default: PURCHASE_STATUS.DRAFT,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    expectedDeliveryDate: {
      type: Date,
      default: null,
    },

    receivedDate: {
      type: Date,
      default: null,
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

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

purchaseSchema.index({
  supplier: 1,
  purchaseDate: -1,
});

purchaseSchema.index({
  supplier: 1,
  purchaseStatus: 1,
});

purchaseSchema.index({
  branch: 1,
});

purchaseSchema.index({
  purchaseStatus: 1,
});

purchaseSchema.index({
  paymentStatus: 1,
});

purchaseSchema.index({
  invoiceNumber: 1,
});

purchaseSchema.index({
  status: 1,
});

purchaseSchema.index({
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Virtuals
|--------------------------------------------------------------------------
*/

purchaseSchema.virtual("items", {
  ref: "PurchaseItem",
  localField: "_id",
  foreignField: "purchase",
});

const Purchase = mongoose.model(
  "Purchase",
  purchaseSchema
);

export default Purchase;