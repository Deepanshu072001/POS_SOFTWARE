import mongoose from "mongoose";
import logger from "./logger.js";
import env from "./env.js";

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI);

    logger.info(
      `MongoDB Connected: ${connection.connection.host}`
    );
  } catch (error) {
    logger.error(error.message);
    throw error;  
}
};

export default connectDatabase;