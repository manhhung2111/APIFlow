import {Application, Request, Response} from "express";
import DBUser from "../entities/user/user";
import Code from '../ap/code';

export const handleLoginUser = async (request: Request, response: Response) => {

};

export const handleRegisterUser = async (request: Request, response: Response): Promise<Response> => {
    const db_user = new DBUser();
    const user = await db_user.findOne();
    console.log(JSON.stringify(user));

    user.reader()?.read();

    console.log(JSON.stringify(user));
    let result = await user.save();
    if (!result) {
        return response.status(400).json(Code.error("Register unsuccessfully"));
    }

    return response.status(201).json(Code.success("Register successfully"))
}

export const handleLogoutUser = async (request: Request, response: Response) => {

}

export const handleForgetPassword = async (request: Request, response: Response) => {

}

export const handleResetPassword = async (request: Request, response: Response) => {

}
