import mongoose from "mongoose";

import STATUS from "../constants/status.js";

const supplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      max_length: 50,
    },

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      max_length: 150,
    },

    contactPerson: {
      type: String,
      default: "",
      trim: true,
      max_length: 100,
    },

    email: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      max_length: 20,
    },

    alternatePhone: {
      type: String,
      default: "",
      trim: true,
      max_length: 20,
    },

    gstNumber: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
      sparse: true,
      unique: true,
    },

    panNumber: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
      max_length: 500,
    },

    city: {
      type: String,
      default: "",
      trim: true,
      max_length: 100,
    },

    state: {
      type: String,
      default: "",
      trim: true,
      max_length: 100,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
      max_length: 100,
    },

    postalCode: {
      type: String,
      default: "",
      trim: true,
      max_length: 20,
    },

    creditLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentTerms: {
      type: Number,
      default: 0,
      min: 0,
    },

    openingBalance: {
      type: Number,
      default: 0,
    },

    currentBalance: {
        type: Number,
        default: 0,
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

    isPreferred: {
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

supplierSchema.index({
  name: 1,
});

supplierSchema.index({
  code: 1,
});

supplierSchema.index({
  phone: 1,
});

supplierSchema.index({
  gstNumber: 1,
});

supplierSchema.index({
  email: 1,
});

supplierSchema.index({
  status: 1,
});

supplierSchema.index({
  isDeleted: 1,
});

const Supplier = mongoose.model(
  "Supplier",
  supplierSchema
);

export default Supplier;