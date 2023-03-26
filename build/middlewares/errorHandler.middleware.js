// Constant imports
import { CONSTANTS } from "../utils/constants.js";
// Service imports
import { ErrorHandlingService } from "../services/errorHandler.service.js";
// Third party
import Joi from "joi";
// Utils
import { apiUtils } from "../utils/api.util.js";
/**
 * @info Handles errors thrown and sends a convenient message to client
 */
const errorHandlerMiddleware = (error, req, res, next) => {
    const response = {
        message: CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG,
        status: CONSTANTS.HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    };
    if (error instanceof ErrorHandlingService) {
        response.message = error.message;
        response.status = error.status;
    }
    if (error instanceof Joi.ValidationError) {
        (response.message = error.message),
            (response.status = CONSTANTS.HTTP_RESPONSE_CODE.BAD_REQUEST);
    }
    if (0)
        next();
    res.status(response.status)
        .json(apiUtils.generateRes(Object.assign(Object.assign({}, response), { status: false })));
};
export { errorHandlerMiddleware };
//# sourceMappingURL=errorHandler.middleware.js.map