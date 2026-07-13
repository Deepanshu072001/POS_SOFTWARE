import { Counter } from "../models/index.js";

const generateBusinessId = async (name, prefix) => {
  const counter = await Counter.findOneAndUpdate(
    { name },
    {
      $inc: { sequence: 1 },
      $setOnInsert: {
        prefix,
        padding: 6,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return `${counter.prefix}-${String(counter.sequence).padStart(
    counter.padding,
    "0"
  )}`;
};

export default generateBusinessId;