import {Code, JWT} from "@ap/core";
import {NextFunction, Request, Response} from 'express';

export default async function authentication(request: Request, response: Response, next: NextFunction) {
    try {
        const token = request.headers.authorization?.split(" ")[1];
        if (!token) {
            response.status(401).json(Code.error("Authorization token required"));
            return;
        }

        response.locals.user = await JWT.verifyToken(token);
        next();
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).json(Code.error(error.message));
        }
        response.status(500).json(Code.error(Code.UNKNOWN_ERROR));
    }
};

