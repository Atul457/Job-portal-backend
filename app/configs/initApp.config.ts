// Third party
import cors from "cors";
import Express, { json } from "express";
import * as express from "express";
import { envConfig } from "./env.config.js";

// Third party

// Configs
import connectMongoDB from "./mongo.config.js";

// Routes import
import { routers } from "../routes/index.routes.js";

// Middleware imports
import { errorHandlerMiddleware } from "../middlewares/errorHandler.middleware.js";

// Paths
import { multerUploadPath } from "./multer.config.js";

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
  app.use("/multer", Express.static(multerUploadPath))

  // Index test route
  app.use(routers.expressRouter)

  // Listeners
  app.listen(APP_PORT);

  // Routes that need db, eg: user router
  app.use("/user", routers.userRouter);

  // Middleware
  app.use(errorHandlerMiddleware);

};

export { initApp };
