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
import { ObjectId } from "mongodb";
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
        const { email, password, name, phone } = req.body;
        const userWithSameEmailExists = yield userExists({ email });
        const userWithSamePhoneExists = yield userExists({ phone });
        if (userWithSameEmailExists.status)
            throw ErrorHandlingService.userAlreadyExists({
                message: RESPONSE_MESSAGES.USER_ALREADY_EXIST_WITH_EMAIL_WITH_EMAIL
            });
        else if (userWithSamePhoneExists.status)
            throw ErrorHandlingService.userAlreadyExists({
                message: RESPONSE_MESSAGES.USER_ALREADY_EXIST_WITH_EMAIL_WITH_PHONE
            });
        const hashedPassword = bcrypt.hashSync(password, parseInt(envConfig.BCRYPT_SALT_ROUNDS));
        const insertRes = yield ((_a = collections.users) === null || _a === void 0 ? void 0 : _a.insertOne({
            name,
            email,
            phone,
            password: hashedPassword,
            created_at: new Date(Date.now()).toUTCString(),
            updated_at: new Date(Date.now()).toUTCString()
        }));
        const { token } = JWTService.createJwtToken({
            email,
            _id: insertRes === null || insertRes === void 0 ? void 0 : insertRes.insertedId
        }, "1y");
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
    var _b, _c, _d, _e, _f, _g;
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
        if (!((_c = user.doc) === null || _c === void 0 ? void 0 : _c._id))
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        let { token } = JWTService.createJwtToken({
            email,
            _id: (_e = (_d = user.doc) === null || _d === void 0 ? void 0 : _d._id) !== null && _e !== void 0 ? _e : ""
        }, "1y");
        const response = apiUtils.generateRes({
            statusCode: CONSTANTS.HTTP_RESPONSE_CODE.OK,
            status: true,
            data: {
                email, name: (_g = (_f = user.doc) === null || _f === void 0 ? void 0 : _f.name) !== null && _g !== void 0 ? _g : "", token
            }
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
/**
 * @info Returns profile details
 */
const getMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        let { _id } = req.body;
        if (!_id)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        let user = yield ((_h = collections.users) === null || _h === void 0 ? void 0 : _h.findOne({
            _id: new ObjectId(_id)
        }, {
            projection: {
                password: 0,
                created_at: 0,
                updated_at: 0
            }
        }));
        if (!user)
            throw ErrorHandlingService.userNotFound();
        const response = apiUtils.generateRes({
            statusCode: CONSTANTS.HTTP_RESPONSE_CODE.OK,
            status: true,
            data: user
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l;
    try {
        const { error } = USER_SCHEMAS.updateProfileSchema.validate(req.body);
        const user_id = (_j = req.body) === null || _j === void 0 ? void 0 : _j._id;
        if (error)
            throw error;
        if (!user_id)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        const { name, phone } = req.body;
        const result = yield ((_k = collections.users) === null || _k === void 0 ? void 0 : _k.updateOne({
            _id: new ObjectId(user_id)
        }, {
            $set: Object.assign(Object.assign(Object.assign({}, (name && { name })), (phone && { phone })), { updated_at: new Date(Date.now()).toUTCString() })
        }));
        const user = yield ((_l = collections.users) === null || _l === void 0 ? void 0 : _l.findOne({
            _id: new ObjectId(user_id)
        }, {
            projection: {
                password: 0,
                created_at: 0,
                updated_at: 0
            }
        }));
        if (!user || !(result === null || result === void 0 ? void 0 : result.matchedCount)) {
            const responseToSend = apiUtils.generateRes({
                status: false,
                statusCode: 200,
                message: RESPONSE_MESSAGES.USER_NOT_FOUND
            });
            return res.json(responseToSend);
        }
        if (result.modifiedCount) {
            const responseToSend = apiUtils.generateRes({
                status: true,
                statusCode: 404,
                message: RESPONSE_MESSAGES.PROFILE_UPDATED,
                data: Object.assign({}, user)
            });
            return res.json(responseToSend);
        }
        throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
    }
    catch (error) {
        next(error);
    }
});
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o, _p, _q;
    try {
        const user_id = (_m = req.body) === null || _m === void 0 ? void 0 : _m._id;
        const email = (_o = req.body) === null || _o === void 0 ? void 0 : _o.email;
        const { error } = USER_SCHEMAS.updatePasswordSchema.validate(req.body);
        if (error)
            throw error;
        if (!user_id || !email)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        const { old_password, new_password } = req.body;
        let user = yield userExists({ email });
        if (!user.status)
            throw ErrorHandlingService.userNotFound();
        const passwordMatched = yield bcrypt.compare(old_password, (_p = user === null || user === void 0 ? void 0 : user.doc) === null || _p === void 0 ? void 0 : _p.password);
        if (!passwordMatched)
            throw ErrorHandlingService.unAuthorized({
                message: RESPONSE_MESSAGES.INVALID_PASSWORD
            });
        const hashedPassword = bcrypt.hashSync(new_password, parseInt(envConfig.BCRYPT_SALT_ROUNDS));
        const result = yield ((_q = collections.users) === null || _q === void 0 ? void 0 : _q.updateOne({
            _id: new ObjectId(user_id)
        }, {
            $set: {
                password: hashedPassword,
                updated_at: new Date(Date.now()).toUTCString()
            }
        }));
        if (result === null || result === void 0 ? void 0 : result.modifiedCount) {
            const responseToSend = apiUtils.generateRes({
                status: true,
                statusCode: 404,
                message: RESPONSE_MESSAGES.PASSWORD_UPDATED
            });
            return res.json(responseToSend);
        }
        throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
    }
    catch (error) {
        next(error);
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = USER_SCHEMAS.logoutSchema.validate(req.body);
        if (error)
            throw error;
        const { token } = req.body;
        JWTService.invalidateToken(token);
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 404,
            message: RESPONSE_MESSAGES.LOGGED_OUT
        });
        return res.json(responseToSend);
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
    var _r;
    const { email, password, phone } = args;
    const user = yield ((_r = collections.users) === null || _r === void 0 ? void 0 : _r.findOne(Object.assign(Object.assign(Object.assign({}, (email && { email })), (phone && { phone })), (password && { password }))));
    return {
        status: user ? true : false,
        doc: user,
    };
});
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
//# sourceMappingURL=user.controller.js.map