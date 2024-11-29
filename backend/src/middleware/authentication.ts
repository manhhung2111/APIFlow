import {Code, JWT} from "@ap/core";
import {NextFunction, Request, Response} from 'express';

export default async function authentication(request: Request, response: Response, next: NextFunction) {
    try {
        const token = request.headers.authorization?.split(" ")[1];
        if (!token) {
            return response.status(401).json(Code.error("Authorization token required"));
        }

        //@ts-ignore
        request.user = await JWT.verifyToken(token);
        next();
    } catch (error) {
        if (error instanceof Error) {
            return response.status(500).json(Code.error(error.message));
        }
        return response.status(500).json(Code.error(Code.UNKNOWN_ERROR));
    }
};

