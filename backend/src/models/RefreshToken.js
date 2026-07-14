import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    deviceInfo: {
      type: String,
      trim: true,
      default: "",
    },

    ipAddress: {
      type: String,
      trim: true,
      default: "",
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

refreshTokenSchema.index({ user: 1 });

refreshTokenSchema.index({ isRevoked: 1 });

/*
|--------------------------------------------------------------------------
| JSON Transform
|--------------------------------------------------------------------------
*/

const transform = (doc, ret) => {
  return ret;
};

refreshTokenSchema.set("toJSON", {
  virtuals: true,
  transform,
});

refreshTokenSchema.set("toObject", {
  virtuals: true,
  transform,
});

const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;