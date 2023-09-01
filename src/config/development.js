import dotenv from "dotenv";

dotenv.config({ path: "./configenv.env" });

const development = {
  MONGODB_CONNECTION_URL: process.env.DEV_MONGODB_CONNECTION_URL,
  PORT: +process.env.PORT,
};

export default development;
