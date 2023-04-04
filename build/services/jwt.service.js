// Third party
import jsonwebtoken from "jsonwebtoken";
// Configs
import { envConfig } from "../configs/env.config.js";
// Constants
import { CONSTANTS } from "../utils/constants.js";
const { sign, verify, decode } = jsonwebtoken;
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
        let error = null;
        let decodedData;
        try {
            decodedData = verify(token, envConfig.JWT_SECRET_KEY);
            return { decodedData: decodedData };
        }
        catch (err) {
            error = err;
            if (error)
                return { error };
        }
        return { error: CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG };
    }
    static invalidateToken(token) {
        const fiveYears = 5;
        const payload = decode(token);
        const newExpiration = new Date();
        newExpiration.setDate(newExpiration.getFullYear() - fiveYears);
        if (payload && typeof payload === "object") {
            sign(Object.assign(Object.assign({}, payload), { exp: newExpiration.getTime() }), envConfig.JWT_SECRET_KEY);
        }
    }
}
export { JWTService };
//# sourceMappingURL=jwt.service.js.map