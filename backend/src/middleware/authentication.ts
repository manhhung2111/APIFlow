import {Code, HTMLInput, JWT} from "@ap/core";
import {NextFunction, Request, Response} from "express";
import Client from "@dev/client";

export default async function authentication(request: Request, response: Response, next: NextFunction){
	try{
		if (Client.authenticated){
			next();
		}

		const token = HTMLInput.signedCookies("access_token");
		if (!token){
			response.status(401).json(Code.error("Authorization token required"));
			return;
		}

		const payload = await JWT.verifyToken(token);
		if (typeof payload === "string"){
			response.status(401).json(Code.error("Invalid or missing user_id in token payload"));
			return;
		}

		if (!await Client.authenticate(payload.user_id)){
			response.status(401).json(Code.error("Cannot authenticate user."));
			return;
		}

		next();
	} catch (error){
		if (error instanceof Error){
			response.status(500).json(Code.error(error.message));
		}
		response.status(500).json(Code.error(Code.UNKNOWN_ERROR));
	}
};

