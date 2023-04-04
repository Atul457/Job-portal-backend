var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Third party
import cors from "cors";
import { json } from "express";
import * as express from "express";
// Configs
import { envConfig } from "./env.config.js";
// Constants
import { CONSTANTS } from "../utils/constants.js";
// Configs
import connectMongoDB from "./mongo.config.js";
// Routes import
import { routers } from "../routes/index.routes.js";
// Middleware imports
import { errorHandlerMiddleware } from "../middlewares/errorHandler.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
/**
 * @info Adds routes and middlewares to app
 */
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    // Mongo connection
    const connectionRes = yield connectMongoDB();
    if (!connectionRes.status)
        return console.log(connectionRes.message);
    // Constants
    const app = express.default();
    const APP_PORT = (envConfig === null || envConfig === void 0 ? void 0 : envConfig.APP_PORT) ? Number(envConfig.APP_PORT) : 3001;
    // Middlewares
    app.use(cors());
    app.use(json());
    // Index test route
    app.use(routers.expressRouter);
    // Listeners
    app.listen(APP_PORT, () => {
        console.log("\n".concat(CONSTANTS.APP_LOG_MESSAGES.SERVER_LISTENING));
    });
    // Routes that need db, eg: user router
    app.use("/job", routers.jobRouter);
    app.use("/user", routers.userRouter);
    app.use("/cloud", routers.cloudRouter);
    app.use("/company", authMiddleware, routers.companyRouter);
    // Middleware
    app.use(errorHandlerMiddleware);
});
export { initApp };
//# sourceMappingURL=initApp.config.js.map