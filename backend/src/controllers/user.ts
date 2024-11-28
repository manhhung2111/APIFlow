import {Request, Response} from "express";
import DBUser from "../entities/user/user";
import Code from '../ap/code';

export const handleLoginUser = async (request: Request, response: Response) => {
    const db_user = new DBUser();
    const user = await db_user.newDocument();

    let read_result = await user.reader()?.readLogin(request.body);
    if (!read_result || !read_result.good()) {
        return response.status(400).json(read_result);
    }
};

export const handleRegisterUser = async (request: Request, response: Response) => {
    try {
        const user = new DBUser();
        user.initialize();

        await user.reader().read(request.body);

        await user.save();

        return response.status(201).json(Code.success("Register new account successfully!"));
    } catch (error) {
        if (error instanceof Error){
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
