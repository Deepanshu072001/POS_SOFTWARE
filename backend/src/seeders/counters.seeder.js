import { Counter } from "../models/index.js";
import counters from "../data/counters.js";

const seedCounters = async () => {
  console.log("🌱 Seeding counters...");

  for (const counter of counters) {
    await Counter.findOneAndUpdate(
      {
        name: counter.name,
      },
      {
        name: counter.name,
        prefix: counter.prefix,
        padding: 6,
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
    }
    );
  }

  console.log(`✅ ${counters.length} counters seeded.`);
};

export default seedCounters;