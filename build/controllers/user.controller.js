var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as bcrypt from "bcrypt";
// Configs
import { collections } from "../configs/mongo.config.js";
import { envConfig } from "../configs/env.config.js";
// Service imports
import { JWTService } from "../services/jwt.service.js";
import { ErrorHandlingService } from "../services/errorHandler.service.js";
// Schemas
import { schemas } from "../utils/schemas.js";
// Constants
import { CONSTANTS } from "../utils/constants.js";
// Helpers
import { apiUtils } from "../utils/api.util.js";
const USER_SCHEMAS = schemas.user;
const RESPONSE_MESSAGES = CONSTANTS.RESPONSE_MESSAGES;
/**
 * @info Handles user signup request
 */
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { error } = USER_SCHEMAS.signupSchema.validate(req.body);
        if (error)
            throw error;
        const { email, password, name } = req.body;
        const response = yield userExists({ email });
        if (response.status)
            throw ErrorHandlingService.userAlreadyExists();
        const hashedPassword = bcrypt.hashSync(password, parseInt(envConfig.BCRYPT_SALT_ROUNDS));
        const insertRes = yield ((_a = collections.users) === null || _a === void 0 ? void 0 : _a.insertOne({
            name,
            email,
            password: hashedPassword,
            created_at: new Date(Date.now()).toUTCString(),
            updated_at: new Date(Date.now()).toUTCString()
        }));
        const { token } = JWTService.createJwtToken({ email }, "2h");
        if (!(insertRes === null || insertRes === void 0 ? void 0 : insertRes.acknowledged))
            throw new Error("Unable to create account");
        let resToSend = apiUtils.generateRes({
            statusCode: CONSTANTS.HTTP_RESPONSE_CODE.OK,
            status: true,
            data: {
                email, name, token
            }
        });
        res.json(resToSend);
    }
    catch (error) {
        next(error);
    }
});
/**
 * @info Handlers sign/login request
 */
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { error } = USER_SCHEMAS.signinSchema.validate(req.body);
        if (error)
            throw error;
        let { email, password } = req.body;
        let user = yield userExists({ email });
        if (!user.status)
            throw ErrorHandlingService.userNotFound();
        const passwordMatched = yield bcrypt.compare(password, (_b = user === null || user === void 0 ? void 0 : user.doc) === null || _b === void 0 ? void 0 : _b.password);
        if (!passwordMatched)
            throw ErrorHandlingService.unAuthorized({
                message: RESPONSE_MESSAGES.INVALID_PASSWORD
            });
        let { token } = JWTService.createJwtToken({
            email
        }, "2h");
        const response = apiUtils.generateRes({
            statusCode: CONSTANTS.HTTP_RESPONSE_CODE.OK,
            status: true,
            data: {
                email,
                token
            }
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
/**
 * @info Checks the user with given credentials exists or not,
 * password is optional when given matches it too
 * @returns Object with status in boolean
 */
const userExists = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { email, password } = args;
    const user = yield ((_c = collections.users) === null || _c === void 0 ? void 0 : _c.findOne(Object.assign({ email }, (password && { password }))));
    return {
        status: user ? true : false,
        doc: user,
    };
});
const userController = {
    signUp,
    signIn
};
export { userController };
//# sourceMappingURL=user.controller.js.map