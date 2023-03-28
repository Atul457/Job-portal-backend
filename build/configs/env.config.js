var _a, _b, _c, _d, _e, _f;
import * as dotenv from "dotenv";
dotenv.config();
export const envConfig = {
    APP_PORT: (_a = process.env.APP_PORT) !== null && _a !== void 0 ? _a : "",
    MONGODB_CONNECTION_STR: (_b = process.env.MONGODB_CONNECTION_STR) !== null && _b !== void 0 ? _b : "",
    MONGO_DB_NAME: (_c = process.env.MONGO_DB_NAME) !== null && _c !== void 0 ? _c : "",
    BCRYPT_SALT_ROUNDS: (_d = process.env.BCRYPT_SALT_ROUNDS) !== null && _d !== void 0 ? _d : "",
    APP_BASE_URL: (_e = process.env.APP_BASE_URL) !== null && _e !== void 0 ? _e : "",
    JWT_SECRET_KEY: (_f = process.env.JWT_SECRET_KEY) !== null && _f !== void 0 ? _f : "54W43SDF_$45__+/3@%5646**"
};
//# sourceMappingURL=env.config.js.map