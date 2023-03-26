// Contants imports
import { CONSTANTS } from "../utils/constants.js";

// Types
import { IErrorHandlerServiceArgs } from "../utils/types.js";

const { RESPONSE_MESSAGES } = CONSTANTS;

/**
 * @info Error Handler is a service that can be used to throw exceptions
 */
class ErrorHandlingService {
  public status = 500;
  public message = "Something went wrong";

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }

  static userAlreadyExists(args?: IErrorHandlerServiceArgs) {
    let { message, status } = args ?? {}
    message = message ?? RESPONSE_MESSAGES.USER_ALREADY_EXIST
    status = status ?? 400
    return new ErrorHandlingService(status, message);
  }

  static userNotFound(args?: IErrorHandlerServiceArgs) {
    let { message, status } = args ?? {}
    message = message ?? RESPONSE_MESSAGES.USER_NOT_FOUND
    status = status ?? 404
    return new ErrorHandlingService(status, message);
  }

  static unAuthorized(args?: IErrorHandlerServiceArgs) {
    let { message, status } = args ?? {}
    message = message ?? RESPONSE_MESSAGES.NO_FILE_SENT
    status = status ?? 403
    return new ErrorHandlingService(status, message);
  }

  static noFileSent(args?: IErrorHandlerServiceArgs) {
    let { message, status } = args ?? {}
    message = message ?? RESPONSE_MESSAGES.NO_FILE_SENT
    status = status ?? 400
    return new ErrorHandlingService(status, message);
  }
}

export { ErrorHandlingService };
