import {Request, Response} from "express";
import {Code, JWT} from "@ap/core";
import {User} from "@entities/user";
import UserService from "@services/user";

export const handleLoginUser = async (request: Request, response: Response) => {
    try {
        const user = await UserService.login(request.body);

        const access_token = await JWT.signToken({user_id: user._id});

        return response.status(200).json(Code.success("Login successful", {access_token: access_token}));
    } catch (error) {
        if (error instanceof Error) {
            return response.status(500).json(Code.error(error.message));
        }
        response.status(500).json(Code.error(Code.UNKNOWN_ERROR));
    }
};

export const handleRegisterUser = async (request: Request, response: Response) => {
    try {
        const user = new User();
        await user.initialize();

        await user.reader().read(request.body);

        await user.save();

        return response.status(201).json(Code.success("Register new account successfully!"));
    } catch (error) {
        if (error instanceof Error) {
            return response.status(500).json(Code.error(error.message));
        }
        response.status(500).json(Code.error(Code.UNKNOWN_ERROR));
    }
}

export const handleLogoutUser = async (request: Request, response: Response) => {

}

export const handleForgetPassword = async (request: Request, response: Response) => {

}

export const handleResetPassword = async (request: Request, response: Response) => {

}
