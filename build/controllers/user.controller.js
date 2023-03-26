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
import { ErrorHandlingService } from "../services/errorHandler.service.js";
// Schemas
import { schemas } from "../utils/schemas.js";
// Constants
import { CONSTANTS } from "../utils/constants.js";
const USER_SCHEMAS = schemas.user;
/**
 * @info Handles user signup request
 */
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { error } = USER_SCHEMAS.signupSchema.validate(req.body);
        if (error)
            throw error;
        const { email, password } = req.body;
        const response = yield userExists({ email });
        if (response.status)
            throw ErrorHandlingService.userAlreadyExists();
        const hashedPassword = bcrypt.hashSync(password, envConfig.BCRYPT_SALT_ROUNDS);
        const insertRes = yield ((_a = collections.users) === null || _a === void 0 ? void 0 : _a.insertOne({
            email,
            password: hashedPassword,
        }));
        if (!(insertRes === null || insertRes === void 0 ? void 0 : insertRes.acknowledged))
            throw new Error("Unable to create account");
        res.json({
            status: CONSTANTS.HTTP_RESPONSE_CODE.OK,
            message: "Account created successfully",
        });
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
    var _b;
    const { email, password } = args;
    const user = yield ((_b = collections.users) === null || _b === void 0 ? void 0 : _b.findOne(Object.assign({ email }, (password && { password }))));
    return {
        status: user ? true : false,
        doc: user,
    };
});
const userController = {
    signUp,
};
export { userController };
//# sourceMappingURL=user.controller.js.map