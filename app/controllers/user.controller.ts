// Third party imports
import type * as Express from "express";
import * as bcrypt from "bcrypt";

// Configs
import { collections } from "../configs/mongo.config.js";
import { envConfig } from "../configs/env.config.js";

// Service imports
import { JWTService } from "../services/jwt.service.js";
import { ErrorHandlingService } from "../services/errorHandler.service.js";

// Schemas
import { schemas } from "../utils/schemas.js";

// Type imports
import { IUserExistsFn } from "../utils/types.js";

// Constants
import { CONSTANTS } from "../utils/constants.js";

// Helpers
import { apiUtils } from "../utils/api.util.js";

const USER_SCHEMAS = schemas.user;
const RESPONSE_MESSAGES = CONSTANTS.RESPONSE_MESSAGES;

/**
 * @info Handles user signup request
 */
const signUp = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  try {
    const { error } = USER_SCHEMAS.signupSchema.validate(req.body);

    if (error) throw error;

    const { email, password, name, phone } = req.body;
    const userWithSameEmailExists = await userExists({ email });
    const userWithSamePhoneExists = await userExists({ phone });

    if (userWithSameEmailExists.status)
      throw ErrorHandlingService.userAlreadyExists({
        message: RESPONSE_MESSAGES.USER_ALREADY_EXIST_WITH_EMAIL_WITH_EMAIL
      });
    else if (userWithSamePhoneExists.status)
      throw ErrorHandlingService.userAlreadyExists({
        message: RESPONSE_MESSAGES.USER_ALREADY_EXIST_WITH_EMAIL_WITH_PHONE
      });

    const hashedPassword = bcrypt.hashSync(
      password,
      parseInt(envConfig.BCRYPT_SALT_ROUNDS)
    );

    const insertRes = await collections.users?.insertOne({
      name,
      email,
      phone,
      password: hashedPassword,
      created_at: new Date(Date.now()).toUTCString(),
      updated_at: new Date(Date.now()).toUTCString()
    });

    const { token } = JWTService.createJwtToken({ email }, "2h");

    if (!insertRes?.acknowledged) throw new Error("Unable to create account");

    let resToSend = apiUtils.generateRes({
      statusCode: CONSTANTS.HTTP_RESPONSE_CODE.OK,
      status: true,
      data: {
        email, name, token
      }
    })

    res.json(resToSend);

  } catch (error: any) {
    next(error);
  }
};


/**
 * @info Handlers sign/login request
 */
const signIn = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  try {
    const { error } = USER_SCHEMAS.signinSchema.validate(req.body);

    if (error) throw error;

    let { email, password } = req.body;

    let user = await userExists({ email });

    if (!user.status) throw ErrorHandlingService.userNotFound();

    const passwordMatched = await bcrypt.compare(password, user?.doc?.password);

    if (!passwordMatched) throw ErrorHandlingService.unAuthorized({
      message: RESPONSE_MESSAGES.INVALID_PASSWORD
    })

    let { token } = JWTService.createJwtToken({
      email
    }, "2h");

    const response = apiUtils.generateRes({
      statusCode: CONSTANTS.HTTP_RESPONSE_CODE.OK,
      status: true,
      data: {
        email, name: user.doc?.name ?? "", token
      }
    })

    res.json(response)

  } catch (error) {
    next(error);
  }
}


/**
 * @info Checks the user with given credentials exists or not,
 * password is optional when given matches it too
 * @returns Object with status in boolean
 */
const userExists: IUserExistsFn = async (args) => {
  const { email, password, phone } = args;

  const user = await collections.users?.findOne({
    ...(email && { email }),
    ...(phone && { phone }),
    ...(password && { password }),
  });

  return {
    status: user ? true : false,
    doc: user,
  };
};

const userController = {
  signUp,
  signIn
};

export { userController };
