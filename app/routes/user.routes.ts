// Third party
import express from "express";

// Controllers
import { userController } from "../controllers/user.controller.js";

// Constants
const userRouter = express.Router();

// Routes

// Auth routes
userRouter.post("/signUp", userController.signUp);
userRouter.post("/signIn", userController.signIn);

export { userRouter };