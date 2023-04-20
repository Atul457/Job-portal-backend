// Third party
import cors from "cors";
import Express, { json } from "express";
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
const initApp = async () => {

  // Mongo connection
  const connectionRes = await connectMongoDB();
  if (!connectionRes.status) return console.log(connectionRes.message);

  // Constants
  const app = express.default();
  const APP_PORT = envConfig?.APP_PORT ? Number(envConfig.APP_PORT) : 3001;

  // Middlewares
  app.use(cors());
  app.use(json());

  // Index test route
  app.use(routers.expressRouter)

  // Listeners
  app.listen(APP_PORT, () => {
    console.log("\n".concat(CONSTANTS.APP_LOG_MESSAGES.SERVER_LISTENING))
  });

  // Routes that need db, eg: user router
  app.use("/job", routers.jobRouter);
  app.use("/user", routers.userRouter);
  app.use("/cloud", routers.cloudRouter);
  app.use("/company", authMiddleware, routers.companyRouter);
  app.use("/notification", authMiddleware, routers.notificationRouter);

  // Middleware
  app.use(errorHandlerMiddleware);

};

export { initApp };
