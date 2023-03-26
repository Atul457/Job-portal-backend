import { ITypeCheck } from "./types.js";
/**
 *
 * @info Checks where a number is undefined on not
 * @returns true, if value is undefined, else false
 */
const undefined = <T>(value: T): boolean => {
  if (typeof value === "undefined") return true;
  return false;
};

const typeCheck: ITypeCheck = {
  isObject: (value) => typeof value === "object",
  isNumber: (value) => typeof value === "number",
  isString: (value) => typeof value === "string",
  isFunction: (value) => typeof value === "function",
  isUndefined: (value) => typeof value === "undefined",
  isBool: (value) => typeof value === "boolean",
};

export const code = {
  undefined,
};

export { undefined, typeCheck };
