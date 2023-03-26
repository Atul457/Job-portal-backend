// Third party
import multer from "multer";
import path from "path";
// Utils
import { fileUtils } from "../utils/files.util.js";
// Constants
const destination = path.join(path.dirname("./"), "app/data/multer/");
const storage = multer.diskStorage({
    destination,
    filename: function (req, file, cb) {
        const postFix = `-${Date.now()}`;
        const fileNameAndExt = fileUtils.splitFileNameAndExt(file.originalname, true);
        const fileName = fileNameAndExt.fileName + postFix + fileNameAndExt.extension;
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