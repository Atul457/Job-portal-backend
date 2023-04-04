// import fs from "fs";
// import path from "path";
// import { Readable } from "stream";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import { multerUploadPath } from "../configs/multer.config.js";
import { apiUtils } from "../utils/api.util.js";
import { CONSTANTS } from "../utils/constants.js";
// Constants
// const KEY_FILE = path.resolve("./", 'app/data/chatzee-2e011da4a858.json');
// const SCOPES = CONSTANTS.GOOGLE_CLOUD_CONSOLE.SCOPES;
// const FOLDER_ID = CONSTANTS.GOOGLE_CLOUD_CONSOLE.FOLDER_ID;
function uploadDocument(fileName, fileContent) {
    return __awaiter(this, void 0, void 0, function* () {
        // try {
        //     const auth = await google.auth.getClient({
        //         scopes: SCOPES,
        //         keyFile: KEY_FILE
        //     });
        //     const drive = google.drive({ version: 'v3', auth });
        //     const fileMetadata = {
        //         name: fileName,
        //         parents: [FOLDER_ID]
        //     };
        //     const res = await drive.files.create(
        //         {
        //             media: {
        //                 body: Readable.from(fileContent),
        //             },
        //             fields: 'webContentLink',
        //             requestBody: {
        //                 ...fileMetadata
        //             }
        //         }
        //     );
        //     if (res && res.data.webContentLink) {
        //         let fileLink = res
        //             .data
        //             .webContentLink
        //             .replace("export=download", "")
        //             .concat("&export=media");
        //         console.log({ fileLink })
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
    });
}
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(apiUtils.generateRes({
        status: false,
        statusCode: 400,
        message: CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG
    }));
    // const FILE_PATH = multerUploadPath + "/Screenshot (2).png";
    // try {
    //     let fileContents = fs.readFileSync(FILE_PATH);
    //     await uploadDocument("file.png", fileContents);
    //     res.json({
    //         message: "Ok"
    //     })
    // } catch (error: any) {
    //     console.log(error)
    //     res.json({
    //         message: CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG
    //     })
    // }
});
export const cloudController = {
    uploadFile
};
//# sourceMappingURL=cloud.controller.js.map