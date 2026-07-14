import { Counter } from "../models/index.js";

const generateBusinessId = async (name, prefix) => {
  const counter = await Counter.findOneAndUpdate(
    { name },
    {
      $inc: { sequence: 1 },
      $setOnInsert: {
        name,
        prefix,
        padding: 6,
      },
    },
    {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
    }
  );

  return `${counter.prefix}-${String(counter.sequence).padStart(
    counter.padding,
    "0"
  )}`;
};

export default generateBusinessId;