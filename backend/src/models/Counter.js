import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
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
      min: 0,
    },

    padding: {
      type: Number,
      default: 6,
      min: 1,
      max: 12,
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


/*
|--------------------------------------------------------------------------
| JSON Transform
|--------------------------------------------------------------------------
*/

const transform = (doc, ret) => ret;

counterSchema.set("toJSON", {
  virtuals: true,
  transform,
});

counterSchema.set("toObject", {
  virtuals: true,
  transform,
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;