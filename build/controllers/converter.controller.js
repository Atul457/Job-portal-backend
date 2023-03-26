var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Third party
import sharp from "sharp";
import JSZip from "jszip";
import * as fs from "fs";
// Constants
import { CONSTANTS } from "../utils/constants.js";
import { multerUploadPath } from "../configs/multer.config.js";
// Utils
import { fileUtils } from "../utils/files.util.js";
import { apiUtils } from "../utils/api.util.js";
import queue from "../utils/queue.util.js";
// Services
import { ErrorHandlingService } from "../services/errorHandler.service.js";
/**
 *  @info Compresses any type of image
 */
const imageCompression = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = ((_a = req.files) !== null && _a !== void 0 ? _a : []);
    const loopCount = files.length;
    try {
        if (!loopCount)
            throw ErrorHandlingService.noFileSent();
        let data = yield queue({ taskList: files, taskHandler: compressFileFn });
        data = data.map(curr => { var _a; return (_a = curr.taskHandlerReturnValue) === null || _a === void 0 ? void 0 : _a.filePath; });
        res.json(apiUtils.generateRes({ data, status: true }));
    }
    catch (error) {
        next(error);
    }
});
/**
 *
 * @param fileToCompress File to compress
 * @info Compresses the provided file
 */
const compressFileFn = (fileToCompress) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        var _a;
        const imagePostFix = "-updated.webp";
        const fileSizeInKb = fileUtils.bytesHelper((_a = fileToCompress.size) !== null && _a !== void 0 ? _a : 0, "kb");
        let pathToSave = fileToCompress.path.split("\\");
        let quality = 80;
        pathToSave.splice(pathToSave.length - 1, 1);
        pathToSave = pathToSave.join("\\");
        const { fileName } = fileUtils.splitFileNameAndExt(fileToCompress.originalname);
        pathToSave = pathToSave + "\\" + fileName + imagePostFix;
        switch (true) {
            case fileSizeInKb > 300:
                quality = 60;
                break;
            case fileSizeInKb > 500:
                quality = 40;
                break;
            case fileSizeInKb > 700:
                quality = 10;
                break;
        }
        sharp(fileToCompress.path)
            .webp({ quality })
            .toFile(pathToSave, (err) => {
            var _a;
            fs.unlinkSync(fileToCompress.path);
            if (err)
                reject({
                    status: false,
                    message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG,
                });
            resolve({
                status: true,
                message: CONSTANTS.APP_LOG_MESSAGES.FILE_CONVERTED_SUCCESSFULLY,
                filePath: `${multerUploadPath}/${fileName}${imagePostFix}`
            });
        });
    });
});
/**
 *  @info Creates a zip and sends it back to the sender in response
 */
const downloadZip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let filePath = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.path;
        if (!filePath)
            throw ErrorHandlingService.unAuthorized({
                message: CONSTANTS.RESPONSE_MESSAGES.INVALID_DATA_SENT
            });
        if (typeof filePath === "string") {
            return res.download(filePath, (err) => {
                if (err)
                    console.log(err);
                else {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log(CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
                        }
                    });
                }
            });
        }
        res.json(apiUtils.generateRes({
            message: CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG,
            status: false
        }));
    }
    catch (error) {
        next(error);
    }
});
/**
 *  @info Creates a zip and sends it back to the sender in response
 */
const createZip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        if (!(req === null || req === void 0 ? void 0 : req.body))
            throw ErrorHandlingService.unAuthorized({
                message: CONSTANTS.RESPONSE_MESSAGES.INVALID_DATA_SENT
            });
        const paths = (_c = req.body) === null || _c === void 0 ? void 0 : _c.paths;
        const JSZipRef = new JSZip();
        if (!paths || !Array.isArray(paths))
            throw ErrorHandlingService.unAuthorized({
                message: CONSTANTS.RESPONSE_MESSAGES.INVALID_DATA_SENT
            });
        const files = paths.map((currPath, index) => {
            return {
                JSZipRef,
                currPath,
                index
            };
        });
        let data = yield queue({
            taskList: files, taskHandler: holdFileToZip, useAcc: {
                keysToAccumulate: ["JSZipRef"]
            }
        });
        let status = false;
        let returnValue;
        if (data.length) {
            returnValue = (_d = data[data.length - 1]) === null || _d === void 0 ? void 0 : _d.taskHandlerReturnValue;
            yield new Promise((resolve, reject) => {
                var _a;
                if (returnValue === null || returnValue === void 0 ? void 0 : returnValue.JSZipRef) {
                    (_a = returnValue === null || returnValue === void 0 ? void 0 : returnValue.JSZipRef) === null || _a === void 0 ? void 0 : _a.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(fs.createWriteStream(returnValue === null || returnValue === void 0 ? void 0 : returnValue.filePath)).on('finish', function () {
                        status = true;
                        resolve(true);
                    }).on("error", (err) => {
                        status = false;
                        reject(err);
                        console.log(err, "err");
                    });
                }
                else {
                    /* This means that the files were already downloaded */
                    reject(CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
                }
            });
        }
        let { fileName, extension } = fileUtils.splitFileNameAndExt(returnValue === null || returnValue === void 0 ? void 0 : returnValue.filePath, true);
        let path = `converter/download_zip?path=${multerUploadPath}/${fileName}${extension}`;
        res.json(apiUtils.generateRes({
            status,
            data: { filePath: path }
        }));
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
/**
 *
 * @param args.currPath Path of the file to read
 * @info Creates a zip and store it on the server
 */
const holdFileToZip = (args) => __awaiter(void 0, void 0, void 0, function* () {
    // Vars
    let { JSZipRef, currPath, index } = args;
    let image;
    let chunks = [];
    let error;
    let pathToSave = `${multerUploadPath}/Result-${Date.now()}.zip`;
    let status = false;
    const readStream = fs.createReadStream(currPath);
    return yield new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield new Promise((innerResolver, innerReject) => {
                readStream.on("data", (chunk) => chunks.push(chunk));
                readStream.on("end", () => {
                    image = Buffer.concat(chunks);
                    status = true;
                    JSZipRef === null || JSZipRef === void 0 ? void 0 : JSZipRef.file(`${Date.now()}-${index}.webp`, image);
                    innerResolver(true);
                });
                readStream.on("error", (err) => {
                    status = false;
                    innerReject(err);
                });
            });
        }
        catch (err) {
            status = false;
            error = err;
        }
        finally {
            // Removing image after adding it into zip file ref
            fs.unlink(currPath, (err) => {
                var _a;
                if (err) {
                    status = false;
                    console.log(err === null || err === void 0 ? void 0 : err.message);
                }
                const message = status ?
                    CONSTANTS.APP_LOG_MESSAGES.FILE_SAVED_SUCCESSFULLY :
                    (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG;
                const dataToResponse = {
                    status,
                    message,
                    filePath: pathToSave,
                    JSZipRef
                };
                if (status)
                    resolve(dataToResponse);
                else
                    reject(dataToResponse);
            });
        }
    }));
});
const converterController = {
    imageCompression,
    createZip,
    downloadZip
};
export { converterController };
//# sourceMappingURL=converter.controller.js.map