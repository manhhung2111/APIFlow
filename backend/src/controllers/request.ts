import {Request, Response} from "express";
import {Code, HTMLInput} from "@ap/core";
import {DBRequest as DBRequest, DBRequestLoader} from "@dev/request";
import mongoose from "mongoose";
import {DBWorkspace} from "@dev/workspace";
import logger from "@utils/logger";
import {RequestService, RequestServiceReader} from "@services/request";

export const createNewRequest = async (request: Request, response: Response) => {
	logger.info("[Controller] Create new request");
	try{
		const request = await DBRequest.initialize() as DBRequest;

		await request.reader().read();

		await request.save();

		response.status(201).json(Code.success("Create new request successfully!"));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const deleteRequest = async (request: Request, response: Response) => {
	logger.info("[Controller] Delete request");

	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const request = await DBRequest.initialize(HTMLInput.param("request_id")) as DBRequest;
		if (!request.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await request.delete(session);

		await request.on().deleted(session);

		await session.commitTransaction();
		response.status(204).json(Code.success(`Delete request \"${request.getField("name")}\" successfully.`));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};

export const duplicateRequest = async (request: Request, response: Response) => {
	logger.info("[Controller] Duplicate request");

	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const old_request = await DBRequest.initialize(HTMLInput.param("request_id")) as DBRequest;
		if (!old_request.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		const new_request = await DBRequest.initialize() as DBRequest;

		await new_request.reader().duplicate(old_request);

		await new_request.save(session);

		await new_request.on().duplicated(old_request, session);

		await session.commitTransaction();
		response.status(204).json(Code.success(`Duplicate request \"${old_request.getField("name")}\" successfully.`));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};

export const getRequestsByWorkspace = async (request: Request, response: Response) => {
	logger.info("[Controller] Get requests by workspace");

	try{
		const workspace = await DBWorkspace.initialize(HTMLInput.param("workspace_id")) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		const requests = await DBRequestLoader.byWorkspace(workspace.object!);
		const requests_compact = requests.map(request => request.releaseCompact());

		response.status(200).json(Code.success("Get all requests successfully.", {requests: requests_compact}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const getRequestById = async (request: Request, response: Response) => {
	logger.info("[Controller] Get request by id");

	try{
		const request = await DBRequest.initialize(HTMLInput.param("request_id")) as DBRequest;
		if (!request.good()){
			response.status(400).json(Code.error(Code.INVALID_DATA));
		}

		response.status(200).json(Code.success(`Get request with id = ${request.getField("_id")} successfully`, {request: request.release()}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const moveRequest = async (request: Request, response: Response) => {

};

export const sendRequest = async (request: Request, response: Response) => {
	logger.info("[Controller] Send a request");

	try{
		const request_reader = new RequestServiceReader();
		request_reader.readMethod()
			.readURL()
			.readParams()
			.readAuthorization()
			.readCookies()
			.readHeaders()
			.readBody()
			.readScripts()
			.readEnvironment();

		const request = new RequestService();
		request.setMethod(request_reader.getMethod())
			.setURL(request_reader.getURL())
			.setParams(request_reader.getParams())
			.setCookies(request_reader.getCookies())
			.setHeaders(request_reader.getHeaders())
			.setAuthorization(request_reader.getAuthorization())
			.setBody(request_reader.getBody())
			.setEnvironment(request_reader.getEnvironment())
			.setScripts(request_reader.getScripts());

		try{
			const result = await request.send();

			response.status(200).json(Code.success("Send request to endpoint successfully.", {...result}));
		} catch (error){
			response.status(502).json(Code.error((error as Error).message, {
				code: "Error",
				"body": JSON.stringify(error),
				"headers": [],
			}));
		}
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateRequest = async (request: Request, response: Response) => {
	logger.info("[Controller] Update request");

	try{
		const request = await DBRequest.initialize(HTMLInput.param("request_id")) as DBRequest;
		if (!request.good()){
			response.status(400).json(Code.error(Code.INVALID_DATA));
		}

		await request.reader().read();

		await request.save();

		response.status(201).json(Code.success("Save request successfully!"));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateRequestName = async (request: Request, response: Response) => {
	logger.info("[Controller] Update request name");

	try{
		const request = await DBRequest.initialize(HTMLInput.param("request_id")) as DBRequest;
		if (!request.good()){
			response.status(400).json(Code.error(Code.INVALID_DATA));
		}

		await request.reader().readName();

		await request.save();

		response.status(201).json(Code.success("Update request name successfully!"));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateRequestContent = async (request: Request, response: Response) => {
	logger.info("[Controller] Update request content");

	try{
		const request = await DBRequest.initialize(HTMLInput.param("request_id")) as DBRequest;
		if (!request.good()){
			response.status(400).json(Code.error(Code.INVALID_DATA));
		}

		await request.reader().readContent();

		await request.save();

		response.status(201).json(Code.success("Update request content successfully!"));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};


