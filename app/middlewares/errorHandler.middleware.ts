// Type imports
import type * as Express from "express";

// Constant imports
import { CONSTANTS } from "../utils/constants.js";

// Service imports
import { ErrorHandlingService } from "../services/errorHandler.service.js";

// Third party
import Joi from "joi";
import Jwt from "jsonwebtoken";

// Utils
import { apiUtils } from "../utils/api.util.js";

/**
 * @info Handles errors thrown and sends a convenient message to client
 */
const errorHandlerMiddleware = (
  error: Express.Errback,
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const response = {
    message: CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG,
    statusCode: CONSTANTS.HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
  };

  if (error instanceof ErrorHandlingService) {
    response.message = error.message;
    response.statusCode = error.status;
  }

  if (error instanceof Joi.ValidationError) {
    (response.message = error.message),
      (response.statusCode = CONSTANTS.HTTP_RESPONSE_CODE.BAD_REQUEST);
  }

  if (error instanceof Jwt.JsonWebTokenError) {
    (response.message = error.message),
      (response.statusCode = CONSTANTS.HTTP_RESPONSE_CODE.UNAUTHORIZED);
  }

  if (0) next();

  res.status(response.statusCode)
    .json(apiUtils.generateRes({ ...response, status: false }));

};

export { errorHandlerMiddleware };
