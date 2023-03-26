// Third party
import cors from "cors";
import Express, { json } from "express";

// Imports
import { app } from "../server.js";

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

  // Middlewares
  app.use(cors());
  app.use(json());
  app.use("/multer", Express.static(multerUploadPath))

  // Index test route
  app.use(routers.expressRouter)

  // Mongo connection
  const connectionRes = await connectMongoDB();
  if (!connectionRes.status) return console.log(connectionRes.message);

  // Routes that need db, eg: user router
  app.use("/user", routers.userRouter);

  // Middleware
  app.use(errorHandlerMiddleware);
  
};

export { initApp };
