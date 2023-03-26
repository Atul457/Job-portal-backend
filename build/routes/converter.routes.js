// Third party
import express from "express";
// Controllers
import { converterController } from "../controllers/converter.controller.js";
// Configs
import { multerConfig } from "../configs/multer.config.js";
// Constants
const converterRouter = express.Router();
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Routes
converterRouter.post("/image_compression", multerConfig.uploadAny, converterController.imageCompression);
converterRouter.post("/create_zip", converterController.createZip);
converterRouter.get("/download_zip", converterController.downloadZip);
export { converterRouter };
//# sourceMappingURL=converter.routes.js.map