import {Request, Response} from "express";
import {Code, JWT} from "@ap/core";
import {User} from "@entities/user";
import UserService from "@services/user";

export const loginUser = async (request: Request, response: Response) => {
	try{
		const user = await UserService.login();

		const access_token = await JWT.signToken({user_id: user._id});

		response.status(200).json(Code.success("Login successful", {access_token: access_token}));
	} catch (error){
		if (error instanceof Error){
			response.status(500).json(Code.error(error.message));
			return;
		}
		response.status(500).json(Code.error(Code.UNKNOWN_ERROR));
	}
};

export const registerUser = async (request: Request, response: Response) => {
	try{
		const user = new User();
		await user.initialize();

		await user.reader().read();

		await user.save();

		response.status(201).json(Code.success("Register new account successfully!"));
	} catch (error){
		if (error instanceof Error){
			response.status(500).json(Code.error(error.message));
			return;
		}
		response.status(500).json(Code.error(Code.UNKNOWN_ERROR));
	}
};

export const logoutUser = async (request: Request, response: Response) => {

};

export const forgotPassword = async (request: Request, response: Response) => {

};

export const resetPassword = async (request: Request, response: Response) => {

};
