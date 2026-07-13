import mongoose from "mongoose";
import logger from "./logger.js";

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    logger.info(
      `MongoDB Connected: ${connection.connection.host}`
    );
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

export default connectDatabase;