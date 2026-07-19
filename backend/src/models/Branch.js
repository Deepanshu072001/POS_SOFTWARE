import mongoose from "mongoose";

import STATUS from "../constants/status.js";

const branchSchema = new mongoose.Schema(
  {
    branchId: {
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
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 10,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email",
      ],
    },

    phone: {
      type: String,
      trim: true,
      default: null,
      match: [
        /^[6-9]\d{9}$/,
        "Invalid phone number",
      ],
    },

    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    address: {
      street: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        default: "India",
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    location: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },

    openingTime: {
      type: String,
      default: "09:00",
    },

    closingTime: {
      type: String,
      default: "22:00",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    currency: {
      type: String,
      default: "INR",
    },

    logo: {
      type: String,
      default: null,
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

branchSchema.index({ city: 1 });
branchSchema.index({ state: 1 });
branchSchema.index({ status: 1 });
branchSchema.index({ isDeleted: 1 });

branchSchema.virtual("fullAddress").get(function () {
  return [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.country,
    this.address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
});

branchSchema.set("toJSON", {
  virtuals: true,
});

branchSchema.set("toObject", {
  virtuals: true,
});

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;