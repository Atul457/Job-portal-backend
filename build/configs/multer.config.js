// Third party
import multer from "multer";
import path from "path";
// Utils
import { fileUtils } from "../utils/files.util.js";
// Constants
const destination = path.join(path.dirname("./"), "app/data/multer");
const storage = multer.diskStorage({
    destination,
    filename: function (req, file, cb) {
        const postFix = `-${Date.now()}.jpg`;
        const fileName = fileUtils.splitFileNameAndExt(file.originalname).fileName + postFix;
        cb(null, fileName);
    },
});
const multerUpload = multer({ storage });
const multerConfig = {
    uploadAny: multerUpload.any(),
};
const multerUploadPath = destination;
export { multerConfig, multerUploadPath };
//# sourceMappingURL=multer.config.js.map