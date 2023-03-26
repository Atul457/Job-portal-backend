// Types
import { splitFileNameAndExtFn, IBytesHelper } from "./types.js";

/**
 * 
 * @param fullFileName Name of the file with or withnot extension
 * @param addDotToExtension If true, returns extension with '.' Dot prefixed
 * @returns Object containing filname and extension
 */
const splitFileNameAndExt: splitFileNameAndExtFn = (
  fullFileName,
  addDotToExtension
) => {
  const valueToReturn: { fileName: string; extension: string } = {
    fileName: fullFileName,
    extension: "",
  };

  let lastStrSegment: any = valueToReturn.fileName?.split("/");
  lastStrSegment = lastStrSegment?.[lastStrSegment?.length - 1] as any
  const tempFileNameSegments = lastStrSegment?.split(".") ?? [];

  valueToReturn.fileName = tempFileNameSegments.slice(0, tempFileNameSegments.length - 1).join("-");
  valueToReturn.extension =
    tempFileNameSegments[tempFileNameSegments.length - 1] ?? "";

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
const bytesHelper: IBytesHelper = (bytes, to = "mb") => {

  let returnValue: number = 0;
  const oneKb = 1000;
  if (typeof bytes !== "number") {
    bytes = 0;
    throw new Error("Bytes sent is not a number")
  }

  switch (to) {
    case "kb": returnValue = bytes / oneKb; break;
    case "mb": returnValue = bytes / Math.pow(oneKb, 2); break;
    case "gb": returnValue = bytes / Math.pow(oneKb, 3); break;
  }

  return parseInt(returnValue.toFixed(0))

}


const fileUtils = {
  splitFileNameAndExt, bytesHelper
};

export { fileUtils };
