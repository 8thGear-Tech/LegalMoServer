import dotenv from "dotenv";

dotenv.config({ path: "./configenv.env" });

const production = {
  MONGODB_CONNECTION_URL: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
  PORT: +process.env.PORT,
};

export default production;
