// Third party
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";

// Configs
import { envConfig } from "../configs/env.config.js";

// Type imports
import { IJwtTypes } from "../utils/types.js";

// Constants
import { CONSTANTS } from "../utils/constants.js"

const { sign, verify, decode } = jsonwebtoken


/**
 * @info Jwt service provides method related to jwt
 */
class JWTService {

    // Function members

    /**
     * @info Creates jwt token
     * @return Returns jwt token, created using the data passed
     */
    static createJwtToken(data: Record<any, any>, expiresIn?: string):
        IJwtTypes["createToken"] {
        let token = sign({
            data
        }, envConfig.JWT_SECRET_KEY, { expiresIn: expiresIn ?? "5m" });

        return { token }
    }


    static verifyJwtToken(token: string)
        : IJwtTypes["verifyToken"] {

        let error: string | null = null;
        let decodedData: JwtPayload | string;

        try {
            decodedData = verify(token, envConfig.JWT_SECRET_KEY) as any
            return { decodedData: decodedData as any };
        } catch (err: any) {
            error = err;
            if (error)
                return { error }
        }

        return { error: CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG }
    }

    static invalidateToken(token: string) {

        const fiveYears = 5;
        const payload = decode(token);
        const newExpiration = new Date();
        newExpiration.setDate(newExpiration.getFullYear() - fiveYears);
        
        if (payload && typeof payload === "object") {
            sign({
                ...payload,
                exp: newExpiration.getTime()
            }, envConfig.JWT_SECRET_KEY);
        }

    }

}

export { JWTService };