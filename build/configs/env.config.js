var _a, _b, _c, _d, _e, _f;
import * as dotenv from "dotenv";
dotenv.config();
export const envConfig = {
    APP_PORT: (_a = process.env.APP_PORT) !== null && _a !== void 0 ? _a : "",
    SOCKET_PORT: (_b = process.env.SOCKET_PORT) !== null && _b !== void 0 ? _b : "",
    MONGODB_CONNECTION_STR: (_c = process.env.MONGODB_CONNECTION_STR) !== null && _c !== void 0 ? _c : "",
    MONGO_DB_NAME: (_d = process.env.MONGO_DB_NAME) !== null && _d !== void 0 ? _d : "",
    BCRYPT_SALT_ROUNDS: (_e = process.env.BCRYPT_SALT_ROUNDS) !== null && _e !== void 0 ? _e : "",
    APP_BASE_URL: (_f = process.env.APP_BASE_URL) !== null && _f !== void 0 ? _f : "",
};
//# sourceMappingURL=env.config.js.map