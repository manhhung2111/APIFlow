import {Request, Response} from "express";
import {Code} from "@ap/core";
import {Request as DBRequest} from "@entities/request";

export const createNewRequest = async (request: Request, response: Response) => {
	try{
		const request = new DBRequest();
		await request.initialize();

		await request.reader().read();

		await request.save();

		response.status(201).json(Code.success("Create new request successfully!"));
	} catch (error){
		if (error instanceof Error){
			response.status(500).json(Code.error(error.message));
		}
		response.status(500).json(Code.error(Code.UNKNOWN_ERROR));
	}
};

export const deleteRequest = async (request: Request, response: Response) => {

};

export const duplicateRequest = async (request: Request, response: Response) => {

};

export const getAllRequests = async (request: Request, response: Response) => {

};

export const getRequestById = async (request: Request, response: Response) => {

};

export const moveRequest = async (request: Request, response: Response) => {

};

export const sendRequest = async (request: Request, response: Response) => {

};

export const updateRequest = async (request: Request, response: Response) => {

};
export const updateRequestContent = async (request: Request, response: Response) => {

};
export const updateRequestName = async (request: Request, response: Response) => {

};
