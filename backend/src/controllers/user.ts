import {Request, Response} from "express";
import {Code, JWT} from "@ap/core";
import {User} from "@dev/user";
import UserService from "@services/user";
import logger from "@utils/logger";

export const loginUser = async (request: Request, response: Response) => {
	try{
		const user = await UserService.login();

		const access_token = await JWT.signToken({user_id: user.getField("_id")});

		response.cookie("access_token", access_token, {signed: true, maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true});
		response.status(200).json(Code.success("Login successful", {access_token: access_token}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const registerUser = async (request: Request, response: Response) => {
	try{
		const user = await User.initialize() as User;

		await user.reader().read();

		await user.save();

		response.status(201).json(Code.success("Register new account successfully!"));
	} catch (error){
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
