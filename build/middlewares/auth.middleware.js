var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Services
import { JWTService } from "../services/jwt.service.js";
import { ErrorHandlingService } from "../services/errorHandler.service.js";
// Mongo
import { ObjectId } from "mongodb";
import { collections } from "../configs/mongo.config.js";
// Constants
import { CONSTANTS } from "../utils/constants.js";
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        if (0)
            console.log(res);
        if (!req.headers.authorization)
            throw ErrorHandlingService.unAuthorized({
                message: CONSTANTS.RESPONSE_MESSAGES.AUTHORIZATION_HEADER_NOT_SENT
            });
        let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.trim().split(" ");
        if (!token[0].includes("Bearer") || token.length !== 2)
            throw ErrorHandlingService.unAuthorized({
                message: CONSTANTS.RESPONSE_MESSAGES.INVALID_AUTHORIZATION_HEADER
            });
        token = token[1];
        const result = JWTService.verifyJwtToken(token);
        if (result.error)
            throw result.error;
        if ((result === null || result === void 0 ? void 0 : result.decodedData) && ((_b = result === null || result === void 0 ? void 0 : result.decodedData) === null || _b === void 0 ? void 0 : _b.data)) {
            const { email, _id } = result.decodedData.data;
            const user = yield ((_c = collections.users) === null || _c === void 0 ? void 0 : _c.findOne({
                _id: new ObjectId(_id)
            }));
            if (!user)
                throw ErrorHandlingService.unAuthorized({
                    message: CONSTANTS.RESPONSE_MESSAGES.INVALID_USER
                });
            req.body._id = _id;
            req.body.email = email;
            return next();
        }
        throw new Error(CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
    }
    catch (error) {
        next(error);
    }
});
export { authMiddleware };
//# sourceMappingURL=auth.middleware.js.map