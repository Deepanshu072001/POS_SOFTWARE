import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    module: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    entityId: {
      type: String,
      default: null,
    },

    ipAddress: {
      type: String,
      trim: true,
      default: "",
    },

    userAgent: {
      type: String,
      trim: true,
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

auditLogSchema.index({ user: 1 });

auditLogSchema.index({ module: 1 });

auditLogSchema.index({ action: 1 });

auditLogSchema.index({ createdAt: -1 });

auditLogSchema.index({ module: 1, action: 1 });

/*
|--------------------------------------------------------------------------
| JSON Transform
|--------------------------------------------------------------------------
*/

const transform = (doc, ret) => ret;

auditLogSchema.set("toJSON", {
  virtuals: true,
  transform,
});

auditLogSchema.set("toObject", {
  virtuals: true,
  transform,
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;