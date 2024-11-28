import jwt from "jsonwebtoken";
import Code from "./code";

class JWTToken {
    private static _TOKEN_MAX_AGE = "7d"; // 7 days

    static async signToken(payload: object) {
        const secret = process.env.JWT_SECRET || "";

        try {
            let token = await jwt.sign(payload, secret, { algorithm: 'RS256',  expiresIn: this._TOKEN_MAX_AGE});
            return token;
        } catch (error) {
            if (error instanceof Error) {
                throw new Code(error.message)
            }
            throw new Code(Code.UNKNOWN_ERROR);
        }
    }

    static async verifyToken(token: string) {
        const secret = process.env.JWT_SECRET || "";

        try {
            let payload = await jwt.verify(token, secret);
            return payload
        } catch (error) {
            if (error instanceof Error) {
                throw new Code(error.message)
            }
            throw new Code(Code.UNKNOWN_ERROR);
        }
    }
}

export default JWTToken;