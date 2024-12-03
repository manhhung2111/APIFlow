import jwt from "jsonwebtoken";
import Code from "./code";

export default class JWT{
	private static _TOKEN_MAX_AGE = "7d"; // 7 days

	static async signToken(payload: object){
		const secret = process.env.JWT_SECRET || "";

		try{
			return jwt.sign(payload, secret, {algorithm: "HS256", expiresIn: this._TOKEN_MAX_AGE});
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	static async verifyToken(token: string){
		const secret = process.env.JWT_SECRET || "";

		try{
			return jwt.verify(token, secret);
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}
}