// Third party
import express from "express";

// Router imports
import { jobRouter } from "./job.routes.js";
import { userRouter } from "./user.routes.js";
import { cloudRouter } from "./cloud.routes.js";
import { companyRouter } from "./company.routes.js";
import { notificationRouter } from "./notification.routes.js";

// Constants imports
import { CONSTANTS } from "../utils/constants.js";

const expressRouter = express.Router();

// Base route
expressRouter.get("/", (req, res) => {
  if (0) console.log(req)
  res.json({ message: CONSTANTS.APP_LOG_MESSAGES.SERVER_LISTENING });
});

// Root route
const routers = {
  userRouter,
  cloudRouter,
  expressRouter,
  companyRouter,
  notificationRouter,
  jobRouter
};

export { routers };
