const splitFileNameAndExt = (fullFileName, addDotToExtension) => {
    var _a, _b;
    const valueToReturn = {
        fileName: fullFileName,
        extension: "",
    };
    const tempFileNameSegments = (_a = valueToReturn === null || valueToReturn === void 0 ? void 0 : valueToReturn.fileName.split(".")) !== null && _a !== void 0 ? _a : [];
    tempFileNameSegments.splice(tempFileNameSegments.length - 1, 1);
    valueToReturn.fileName = tempFileNameSegments.join("-");
    valueToReturn.extension =
        (_b = tempFileNameSegments[tempFileNameSegments.length - 1]) !== null && _b !== void 0 ? _b : "";
    if (addDotToExtension)
        valueToReturn.extension = "." + valueToReturn.extension;
    return valueToReturn;
};
const fileUtils = {
    splitFileNameAndExt,
};
export { fileUtils };
//# sourceMappingURL=files.js.map