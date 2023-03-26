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
import Express, { json } from "express";
// Imports
import { app } from "../server.js";
// Routes import
import { routers } from "../routes/index.routes.js";
// Middleware imports
import { errorHandlerMiddleware } from "../middlewares/errorHandler.middleware.js";
// Paths
import { multerUploadPath } from "./multer.config.js";
/**
 * @info Adds routes and middlewares to app
 */
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    // Middlewares
    app.use(cors());
    app.use(json());
    app.use("/multer", Express.static(multerUploadPath));
    // Index test route
    app.use(routers.expressRouter);
    // Controller router
    app.use("/converter", routers.converterRouter);
    app.use(errorHandlerMiddleware);
    // // Mongo connection
    // const connectionRes = await connectMongoDB();
    // if (!connectionRes.status) return console.log(connectionRes.message);
    // // Routes that need db, eg: user router
    // app.use("/user", routers.userRouter);
    // app.use(errorHandlerMiddleware);
});
export { initApp };
//# sourceMappingURL=initApp.config.js.map