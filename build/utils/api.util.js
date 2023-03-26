/**
 * @param args IGenerateResFn
 * @returns Response obj, created using given args
 */
const generateRes = (args) => {
    const { status, message = null, data = null } = args;
    return {
        status, message, data
    };
};
const apiUtils = {
    generateRes
};
export { apiUtils };
//# sourceMappingURL=api.util.js.map