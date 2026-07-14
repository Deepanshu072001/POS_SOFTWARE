import mongoose from "mongoose";
import STATUS from "../constants/status.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 255,
      default: "",
    },

    permissions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Permission",
        },
      ],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },

    isSystem: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
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


roleSchema.index({ status: 1 });

roleSchema.index({ isDeleted: 1 });

roleSchema.index({ status: 1, isDeleted: 1 });

/*
|--------------------------------------------------------------------------
| JSON Transform
|--------------------------------------------------------------------------
*/

const transform = (doc, ret) => ret;

roleSchema.set("toJSON", {
  virtuals: true,
  transform,
});

roleSchema.set("toObject", {
  virtuals: true,
  transform,
});

const Role = mongoose.model("Role", roleSchema);

export default Role;