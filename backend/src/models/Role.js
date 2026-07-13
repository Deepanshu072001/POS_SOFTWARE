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
      default: "",
      trim: true,
    },

    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],

    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },

    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
roleSchema.index({ name: 1 }, { unique: true });
roleSchema.index({ status: 1 });

// Prevent deleting system roles
roleSchema.pre("deleteOne", { document: true, query: false }, function (next) {
  if (this.isSystem) {
    return next(new Error("System roles cannot be deleted."));
  }
  next();
});

const Role = mongoose.model("Role", roleSchema);

export default Role;