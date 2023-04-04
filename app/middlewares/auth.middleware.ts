import * as Express from "express";

// Services
import { JWTService } from "../services/jwt.service.js";
import { ErrorHandlingService } from "../services/errorHandler.service.js";

// Mongo
import { ObjectId } from "mongodb";
import { collections } from "../configs/mongo.config.js";

// Constants
import { CONSTANTS } from "../utils/constants.js";

const authMiddleware = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        if (0) console.log(res);

        if (!req.headers.authorization)
            throw ErrorHandlingService.unAuthorized({
                message: CONSTANTS.RESPONSE_MESSAGES.AUTHORIZATION_HEADER_NOT_SENT
            });

        let token: string | string[] = req.headers.authorization
            ?.trim()
            .split(" ");

        if (!token[0].includes("Bearer") || token.length !== 2)
            throw ErrorHandlingService.unAuthorized({
                message: CONSTANTS.RESPONSE_MESSAGES.INVALID_AUTHORIZATION_HEADER
            });

        token = token[1];

        const result = JWTService.verifyJwtToken(token);

        if (result.error)
            throw result.error;

        if (result?.decodedData && result?.decodedData?.data) {

            const { email, _id } = result.decodedData.data

            const user = await collections.users?.findOne({
                _id: new ObjectId(_id)
            })

            if (!user)
                throw ErrorHandlingService.unAuthorized({
                    message: CONSTANTS.RESPONSE_MESSAGES.INVALID_USER
                })

            req.body._id = _id;
            req.body.email = email;

            return next();
        }

        throw new Error(CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

    } catch (error) {
        next(error)
    }

}

export { authMiddleware }