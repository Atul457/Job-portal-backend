// Third party
import jsonwebtoken from "jsonwebtoken";
// Configs
import { envConfig } from "../configs/env.config.js";
// Constants
import { CONSTANTS } from "../utils/constants.js";
const { sign, verify } = jsonwebtoken;
/**
 * @info Jwt service provides method related to jwt
 */
class JWTService {
    // Function members
    /**
     * @info Creates jwt token
     * @return Returns jwt token, created using the data passed
     */
    static createJwtToken(data, expiresIn) {
        let token = sign({
            data
        }, envConfig.JWT_SECRET_KEY, { expiresIn: expiresIn !== null && expiresIn !== void 0 ? expiresIn : "5m" });
        return { token };
    }
    static verifyJwtToken(token) {
        var _a;
        let error = null;
        let decodedData;
        try {
            decodedData = verify(token, envConfig.JWT_SECRET_KEY);
            return { decodedData };
        }
        catch (err) {
            error = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG;
            if (error)
                return { error };
        }
        return { error: CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG };
    }
}
export { JWTService };
//# sourceMappingURL=jwt.service.js.map