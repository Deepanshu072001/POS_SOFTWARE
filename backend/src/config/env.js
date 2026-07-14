import dotenv from "dotenv";

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT || 5000,

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  ACCESS_TOKEN_EXPIRE:
    process.env.ACCESS_TOKEN_EXPIRE || "15m",

  REFRESH_TOKEN_EXPIRE:
    process.env.REFRESH_TOKEN_EXPIRE || "7d",

  DEFAULT_OWNER_EMAIL:
    process.env.DEFAULT_OWNER_EMAIL ||
    "owner@cafeflow.com",

  DEFAULT_OWNER_PASSWORD:
    process.env.DEFAULT_OWNER_PASSWORD ||
    "Owner@123",
};

export default env;