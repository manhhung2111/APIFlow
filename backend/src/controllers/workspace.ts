import {Request, Response} from "express";
import {Code, HTMLInput} from "@ap/core";
import {DBWorkspace, DBWorkspaceLoader} from "@dev/workspace";
import mongoose from "mongoose";
import logger from "@utils/logger";

export const getAllWorkspaces = async (request: Request, response: Response) => {
	logger.info("[Controller] Get all workspaces");

	try{
		const workspaces = await DBWorkspaceLoader.mine();
		const workspaces_compact = workspaces.map(workspace => workspace.release());

		response.status(200).json(Code.success("Get all workspaces successfully.", {workspaces: workspaces_compact}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const getWorkspaceById = async (request: Request, response: Response) => {
	logger.info("[Controller] Get workspace by ID");
	try{
		console.log(request.params)
		const workspace_id = HTMLInput.param("workspace_id");

		const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		response.status(200).json(Code.success(`Get workspace-${workspace_id} successfully.`, {workspace: workspace.release()}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const createNewWorkspace = async (request: Request, response: Response) => {
	logger.info("[Controller] Create new workspace");

	try{
		const workspace = await DBWorkspace.initialize() as DBWorkspace;

		await workspace.reader().read();

		await workspace.save();

		await workspace.fs().setFollowing();

		response.status(201).json(Code.success(`Create a new workspace successfully.`, {workspace: workspace.release()}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateWorkspaceName = async (request: Request, response: Response) => {
	logger.info("[Controller] Update workspace name");

	try{
		const workspace = await DBWorkspace.initialize(HTMLInput.param("workspace_id")) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await workspace.reader().readName();

		await workspace.save();

		response.status(201).json(Code.error(`Update workspace successfully.`, {workspace: workspace.release()}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateWorkspaceContent = async (request: Request, response: Response) => {
	logger.info("[Controller] Update workspace content");

	try{
		const workspace = await DBWorkspace.initialize(HTMLInput.param("workspace_id")) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await workspace.reader().readContent();

		await workspace.save();

		response.status(201).json(Code.error(`Update workspace successfully.`, {workspace: workspace.release()}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const deleteWorkspace = async (request: Request, response: Response) => {
	logger.info("[Controller] Delete workspace");

	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const workspace_id = HTMLInput.param("workspace_id");

		const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await workspace.delete(session);

		await workspace.on().deleted();

		await session.commitTransaction();

		response.status(204).json(Code.success(`Delete workspace \"${workspace.getField("name")}\" successfully.`));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};