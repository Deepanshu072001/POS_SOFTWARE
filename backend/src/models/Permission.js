import mongoose from "mongoose";
import STATUS from "../constants/status.js";

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    module: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 255,
      default: "",
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


permissionSchema.index({ module: 1 });

permissionSchema.index({ status: 1 });

permissionSchema.index({ isDeleted: 1 });

permissionSchema.index({ module: 1, action: 1 });

/*
|--------------------------------------------------------------------------
| JSON Transform
|--------------------------------------------------------------------------
*/

const transform = (doc, ret) => ret;

permissionSchema.set("toJSON", {
  virtuals: true,
  transform,
});

permissionSchema.set("toObject", {
  virtuals: true,
  transform,
});

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;