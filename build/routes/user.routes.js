// Third party
import express from "express";
// Controllers
import { userController } from "../controllers/user.controller.js";
// Middlewares
import { authMiddleware } from "../middlewares/auth.middleware.js";
// Constants
const userRouter = express.Router();
// Routes
// Auth routes
userRouter.post("/signUp", userController.signUp);
userRouter.post("/signIn", userController.signIn);
userRouter.post("/logout", authMiddleware, userController.logout);
userRouter.get("/getMyProfile", authMiddleware, userController.getMyProfile);
userRouter.post("/updatePassword", authMiddleware, userController.updatePassword);
userRouter.post("/updateProfile", authMiddleware, userController.updateProfile);
export { userRouter };
//# sourceMappingURL=user.routes.js.map