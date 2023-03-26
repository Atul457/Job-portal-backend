import * as dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  APP_PORT: process.env.APP_PORT ?? "",
  MONGODB_CONNECTION_STR: process.env.MONGODB_CONNECTION_STR ?? "",
  MONGO_DB_NAME: process.env.MONGO_DB_NAME ?? "",
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS ?? "",
  APP_BASE_URL: process.env.APP_BASE_URL ?? "",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ?? "54W43SDF_$45__+/3@%5646**"
};
