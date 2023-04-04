// Contants imports
import { CONSTANTS } from "../utils/constants.js";
const { RESPONSE_MESSAGES } = CONSTANTS;
/**
 * @info Error Handler is a service that can be used to throw exceptions
 */
class ErrorHandlingService {
    constructor(status, message) {
        this.status = 500;
        this.message = "Something went wrong";
        this.status = status;
        this.message = message;
    }
    static userAlreadyExists(args) {
        let { message, status } = args !== null && args !== void 0 ? args : {};
        message = message !== null && message !== void 0 ? message : RESPONSE_MESSAGES.USER_ALREADY_EXIST_WITH_EMAIL_WITH_EMAIL;
        status = status !== null && status !== void 0 ? status : 400;
        return new ErrorHandlingService(status, message);
    }
    static userNotFound(args) {
        let { message, status } = args !== null && args !== void 0 ? args : {};
        message = message !== null && message !== void 0 ? message : RESPONSE_MESSAGES.USER_NOT_FOUND;
        status = status !== null && status !== void 0 ? status : 404;
        return new ErrorHandlingService(status, message);
    }
    static unAuthorized(args) {
        let { message, status } = args !== null && args !== void 0 ? args : {};
        message = message !== null && message !== void 0 ? message : RESPONSE_MESSAGES.UN_AUTHORIZED;
        status = status !== null && status !== void 0 ? status : 403;
        return new ErrorHandlingService(status, message);
    }
    static noFileSent(args) {
        let { message, status } = args !== null && args !== void 0 ? args : {};
        message = message !== null && message !== void 0 ? message : RESPONSE_MESSAGES.NO_FILE_SENT;
        status = status !== null && status !== void 0 ? status : 400;
        return new ErrorHandlingService(status, message);
    }
}
export { ErrorHandlingService };
//# sourceMappingURL=errorHandler.service.js.map