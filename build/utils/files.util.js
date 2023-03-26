/**
 *
 * @param fullFileName Name of the file with or withnot extension
 * @param addDotToExtension If true, returns extension with '.' Dot prefixed
 * @returns Object containing filname and extension
 */
const splitFileNameAndExt = (fullFileName, addDotToExtension) => {
    var _a, _b, _c;
    const valueToReturn = {
        fileName: fullFileName,
        extension: "",
    };
    let lastStrSegment = (_a = valueToReturn.fileName) === null || _a === void 0 ? void 0 : _a.split("/");
    lastStrSegment = lastStrSegment[lastStrSegment.length - 1];
    const tempFileNameSegments = (_b = lastStrSegment === null || lastStrSegment === void 0 ? void 0 : lastStrSegment.split(".")) !== null && _b !== void 0 ? _b : [];
    valueToReturn.fileName = tempFileNameSegments.slice(0, tempFileNameSegments.length - 1).join("-");
    valueToReturn.extension =
        (_c = tempFileNameSegments[tempFileNameSegments.length - 1]) !== null && _c !== void 0 ? _c : "";
    if (addDotToExtension)
        valueToReturn.extension = "." + valueToReturn.extension;
    return valueToReturn;
};
/**
 *
 * @param bytes No of bytes
 * @param to In format to convert
 * @returns Bytes converted to given format
 */
const bytesHelper = (bytes, to = "mb") => {
    let returnValue = 0;
    const oneKb = 1000;
    if (typeof bytes !== "number") {
        bytes = 0;
        throw new Error("Bytes sent is not a number");
    }
    switch (to) {
        case "kb":
            returnValue = bytes / oneKb;
            break;
        case "mb":
            returnValue = bytes / Math.pow(oneKb, 2);
            break;
        case "gb":
            returnValue = bytes / Math.pow(oneKb, 3);
            break;
    }
    return parseInt(returnValue.toFixed(0));
};
const fileUtils = {
    splitFileNameAndExt, bytesHelper
};
export { fileUtils };
//# sourceMappingURL=files.util.js.map