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
import { ObjectId } from "mongodb";

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

    const { token } = JWTService.createJwtToken({
      email,
      _id: insertRes?.insertedId
    }, "1y");

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

    if (!passwordMatched)
      throw ErrorHandlingService.unAuthorized({
        message: RESPONSE_MESSAGES.INVALID_PASSWORD
      })

    if (!user.doc?._id) throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG)

    let { token } = JWTService.createJwtToken({
      email,
      _id: user.doc?._id ?? ""
    }, "1y");

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
 * @info Returns profile details
 */
const getMyProfile = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  try {

    let { _id } = req.body;

    if (!_id)
      throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG)

    let user = await collections.users?.findOne(
      {
        _id: new ObjectId(_id)
      },
      {
        projection: {
          password: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    );

    if (!user) throw ErrorHandlingService.userNotFound();

    const response = apiUtils.generateRes({
      statusCode: CONSTANTS.HTTP_RESPONSE_CODE.OK,
      status: true,
      data: user
    })

    res.json(response)

  } catch (error) {
    next(error);
  }
}


const updateProfile = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {

  try {

    const { error } = USER_SCHEMAS.updateProfileSchema.validate(req.body);
    const user_id = req.body?._id;

    if (error) throw error;
    if (!user_id) throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG)

    const { name, phone } = req.body;

    const result = await collections.users?.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(name && { name }),
          ...(phone && { phone }),
          updated_at: new Date(Date.now()).toUTCString()
        }
      }
    );

    const user = await collections.users?.findOne({
      _id: new ObjectId(user_id)
    }, {
      projection: {
        password: 0,
        created_at: 0,
        updated_at: 0
      }
    })

    if (!user || !result?.matchedCount) {
      const responseToSend = apiUtils.generateRes({
        status: false,
        statusCode: 200,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND
      })
      return res.json(responseToSend);
    }

    if (result.modifiedCount) {
      const responseToSend = apiUtils.generateRes({
        status: true,
        statusCode: 404,
        message: RESPONSE_MESSAGES.PROFILE_UPDATED,
        data: {
          ...user
        }
      })
      return res.json(responseToSend);
    }

    throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

  } catch (error) {
    next(error)
  }

}
const updatePassword = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {

  try {

    const user_id = req.body?._id;
    const email = req.body?.email;
    const { error } = USER_SCHEMAS.updatePasswordSchema.validate(req.body);

    if (error) throw error;

    if (!user_id || !email)
      throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG)

    const { old_password, new_password } = req.body;

    let user = await userExists({ email });

    if (!user.status) throw ErrorHandlingService.userNotFound();

    const passwordMatched = await bcrypt.compare(old_password, user?.doc?.password);

    if (!passwordMatched)
      throw ErrorHandlingService.unAuthorized({
        message: RESPONSE_MESSAGES.INVALID_PASSWORD
      })

    const hashedPassword = bcrypt.hashSync(
      new_password,
      parseInt(envConfig.BCRYPT_SALT_ROUNDS)
    );

    const result = await collections.users?.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hashedPassword,
          updated_at: new Date(Date.now()).toUTCString()
        }
      }
    );

    if (result?.modifiedCount) {
      const responseToSend = apiUtils.generateRes({
        status: true,
        statusCode: 404,
        message: RESPONSE_MESSAGES.PASSWORD_UPDATED
      })
      return res.json(responseToSend);
    }

    throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

  } catch (error) {
    next(error)
  }

}


const logout = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {

  try {

    const { error } = USER_SCHEMAS.logoutSchema.validate(req.body);

    if (error) throw error;

    const { token } = req.body;

    JWTService.invalidateToken(token)

    const responseToSend = apiUtils.generateRes({
      status: true,
      statusCode: 404,
      message: RESPONSE_MESSAGES.LOGGED_OUT
    })

    return res.json(responseToSend);

  } catch (error) {
    next(error)
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
  signIn,
  logout,
  userExists,
  getMyProfile,
  updateProfile,
  updatePassword
};

export { userController };
