// Third party
import express from "express";
// Controllers
import { cloudController } from "../controllers/cloud.controller.js";
// Constants
const cloudRouter = express.Router();
// Routes
cloudRouter.post("/uploadFile", cloudController.uploadFile);
export { cloudRouter };
//# sourceMappingURL=cloud.routes.js.map