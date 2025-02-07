import {Request, Response} from "express";
import {Code, HTMLInput, JWT} from "@ap/core";
import {DBUser} from "@dev/user";
import UserService from "@services/user";
import logger from "@utils/logger";
import Client from "@dev/client";

export const loginUser = async (request: Request, response: Response) => {
    try {
        const user = await UserService.login();

        const access_token = await JWT.signToken({user_id: user.getField("_id")});

        response.cookie("access_token", access_token, {signed: true, maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true});
        response.status(200).json(Code.success("Login successful", {user: user.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const registerUser = async (request: Request, response: Response) => {
    try {
        const user = await DBUser.initialize() as DBUser;

        await user.reader().read();

        await user.save();

        response.status(201).json(Code.success("Register new account successfully!"));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const logoutUser = async (request: Request, response: Response) => {

};

export const forgotPassword = async (request: Request, response: Response) => {

};

export const resetPassword = async (request: Request, response: Response) => {

};

export const verifyUser = async (request: Request, response: Response) => {
    const token = HTMLInput.signedCookies("access_token");

    if (!token) {
        response.status(401).json(Code.error("Authorization token required"));
        return;
    }

    const payload = await JWT.verifyToken(token);
    if (typeof payload === "string") {
        response.status(401).json(Code.error("Invalid or missing user_id in token payload"));
        return;
    }

    const user = await Client.authenticate(payload.user_id);
    if (!user) {
        response.status(401).json(Code.error("Cannot authenticate user."));
        return;
    }

    response.status(200).json(Code.success("User verified successful", {user: user.release()}));
};
