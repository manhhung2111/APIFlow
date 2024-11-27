import {Request, Response} from "express";
import DBUser from "../entities/user/user";

export const handleLoginUser = async (request: Request, response: Response) => {

};

export const handleRegisterUser = async (request: Request, response: Response): Promise<Response> => {
    const db_user = new DBUser();
    const user = await db_user.newDocument();

    let read_result = await user.reader()?.read(request.body);
    if (!read_result || !read_result.good()) {
        return response.status(400).json(read_result);
    }

    let save_result = await user.save();
    if (!save_result.good()) {
        return response.status(500).json(save_result);
    }

    return response.status(201).json(save_result)
}

export const handleLogoutUser = async (request: Request, response: Response) => {

}

export const handleForgetPassword = async (request: Request, response: Response) => {

}

export const handleResetPassword = async (request: Request, response: Response) => {

}
