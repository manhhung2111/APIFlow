import {Request, Response} from "express";
import {Code, HTMLInput} from "@ap/core";
import {DBWorkspace, DBWorkspaceLoader} from "@dev/workspace";
import mongoose from "mongoose";
import {Collection} from "@dev/collection";
import {Folder} from "@dev/folder";
import {Request as DBRequest} from "@dev/request";
import {DBCondition} from "@ap/db";
import {Example} from "@dev/example";
import {Environment} from "@dev/environment";
import logger from "@utils/logger";

export const getAllWorkspaces = async (request: Request, response: Response) => {
	try{
		logger.info("[Controller] Get all workspaces");
		const workspaces = await DBWorkspaceLoader.mine();
		const workspaces_compact = workspaces.map(workspace => workspace.releaseCompact());

		response.status(200).json(Code.success("Get all workspaces successfully.", {workspaces: workspaces_compact}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const getWorkspaceById = async (request: Request, response: Response) => {
	try{
		logger.info("[Controller] Get workspace by ID");
		const workspace_id = HTMLInput.param("workspace_id");
		if (!workspace_id){
			response.status(400).json(Code.error("Missing params: workspace_id"));
		}

		const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		response.status(200).json(Code.error(`Get workspace-${workspace_id} successfully.`, {workspace: workspace.release()}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const createNewWorkspace = async (request: Request, response: Response) => {
	try{
		logger.info("[Controller] Create new workspace");
		const workspace = await DBWorkspace.initialize() as DBWorkspace;

		await workspace.reader().read();

		await workspace.save();
		logger.info("Pass read workspace and save");

		response.status(201).json(Code.success(`Create a new workspace successfully.`, {workspace: workspace.release()}));
		return;
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateWorkspaceName = async (request: Request, response: Response) => {
	try{
		logger.info("[Controller] Update workspace");
		const workspace_id = HTMLInput.param("workspace_id");
		if (!workspace_id){
			response.status(400).json(Code.error("Missing params: workspace_id"));
		}

		const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await workspace.reader().readName();

		await workspace.save();

		response.status(201).json(Code.error(`Update workspace successfully.`, {workspace: workspace.release()}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateWorkspaceContent = async (request: Request, response: Response) => {
	try{
		logger.info("[Controller] Update workspace content");
		const workspace_id = HTMLInput.param("workspace_id");
		if (!workspace_id){
			response.status(400).json(Code.error("Missing params: workspace_id"));
		}

		const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await workspace.reader().readContent();

		await workspace.save();

		response.status(201).json(Code.error(`Update workspace successfully.`, {workspace: workspace.release()}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const deleteWorkspace = async (request: Request, response: Response) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		logger.info("[Controller] Delete workspace");
		const workspace_id = HTMLInput.param("workspace_id");
		if (!workspace_id){
			response.status(400).json(Code.error("Missing params: workspace_id"));
		}

		const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		let sc = new DBCondition().setFilter({workspace_id: workspace_id});

		await Collection.deleteMany(sc, session);

		await Folder.deleteMany(sc, session);

		await DBRequest.deleteMany(sc, session);

		await Example.deleteMany(sc, session);

		await Environment.deleteMany(sc, session);

		await workspace.delete();

		await session.commitTransaction();
		response.status(204).json(Code.success(`Delete workspace \"${workspace.getField("name")}\" successfully.`));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};