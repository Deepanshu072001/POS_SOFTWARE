import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    prefix: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    sequence: {
      type: Number,
      default: 0,
    },

    padding: {
      type: Number,
      default: 6,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

counterSchema.index({ name: 1 }, { unique: true });

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;