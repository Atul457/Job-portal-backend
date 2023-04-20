// Third party
import express from "express";
// Controllers
import { notificationController } from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
// Constants
const notificationRouter = express.Router();
// Routes
notificationRouter.get("/getMyNotifications", authMiddleware, notificationController.getMyNotifications);
export { notificationRouter };
//# sourceMappingURL=notification.routes.js.map