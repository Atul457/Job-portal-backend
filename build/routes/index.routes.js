// Third party
import express from "express";
// Router imports
import { converterRouter } from "./converter.routes.js";
import { userRouter } from "./user.routes.js";
// Constants imports
import { CONSTANTS } from "../utils/constants.js";
const expressRouter = express.Router();
// Base route
expressRouter.get("/", (req, res) => {
    res.json({ message: CONSTANTS.APP_LOG_MESSAGES.SERVER_LISTENING });
});
// Root route
const routers = {
    converterRouter,
    userRouter,
    expressRouter,
};
export { routers };
//# sourceMappingURL=index.routes.js.map