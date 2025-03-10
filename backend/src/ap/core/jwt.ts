import jwt, {Algorithm} from "jsonwebtoken";
import Code from "./code";

export default class JWT{
	private static _TOKEN_MAX_AGE = "7d"; // 7 days

	static async signToken(payload: object, secret_key = "", algorithm: Algorithm = "HS256" ){
		const secret = secret_key || process.env.JWT_SECRET || "";

		try{
			return jwt.sign(payload, secret, {algorithm: algorithm, expiresIn: this._TOKEN_MAX_AGE});
		} catch (error){
			throw new Code((error as Error).message);
		}
	}

	static async verifyToken(token: string){
		const secret = process.env.JWT_SECRET || "";

		try{
			return jwt.verify(token, secret);
		} catch (error){
			throw new Code((error as Error).message);
		}
	}
}