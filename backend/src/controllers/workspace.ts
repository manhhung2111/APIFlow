import {Request, Response} from "express";
import {Code, HTMLInput} from "@ap/core";
import {DBWorkspace, DBWorkspaceLoader} from "@dev/workspace";
import mongoose from "mongoose";
import logger from "@utils/logger";
import {DBCollectionLoader} from "@dev/collection";
import {DBFolderLoader} from "@dev/folder";
import {DBRequestLoader} from "@dev/request";
import {DBEnvironmentLoader} from "@dev/environment";
import {DBExampleLoader} from "@dev/example";

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
		const workspace_id = HTMLInput.param("workspace_id");
		if (workspace_id.length != 24) {
			response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
		}

		const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
		if (!workspace.good()){
			response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
		}

		const collections = await DBCollectionLoader.byWorkspace(workspace.object!);
		const collections_compact = collections.map(collection => collection.releaseCompact());

		const folders = await DBFolderLoader.byWorkspace(workspace.object!);
		const folders_compact = folders.map(folder => folder.releaseCompact());

		const requests = await DBRequestLoader.byWorkspace(workspace.object!);
		const requests_compact = requests.map(request => request.releaseCompact());

		const environments = await DBEnvironmentLoader.byWorkspace(workspace.object!);
		const environments_compact = environments.map(environment => environment.release());

		const examples = await DBExampleLoader.byWorkspace(workspace.object!);
		const examples_compact = examples.map(example => example.releaseCompact());

		response.status(200).json(Code.success(`Get workspace-${workspace_id} successfully.`, {
			workspace: workspace.release(),
			collections: collections_compact,
			folders: folders_compact,
			requests: requests_compact,
			environments: environments_compact,
			examples: examples_compact,
		}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const createNewWorkspace = async (request: Request, response: Response) => {
	logger.info("[Controller] Create new workspace");

	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const workspace = await DBWorkspace.initialize() as DBWorkspace;

		await workspace.reader().read();

		await workspace.save(session);

		await workspace.on().created(session);

		await session.commitTransaction();

		response.status(201).json(Code.success(`Create a new workspace successfully.`, {workspace: workspace.releaseCompact()}));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};

export const updateWorkspace = async (request: Request, response: Response) => {
	logger.info("[Controller] Update workspace");

	try{
		const workspace_id = HTMLInput.param("workspace_id");
		if (workspace_id.length != 24) {
			response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
		}

		const workspace = await DBWorkspace.initialize(HTMLInput.param("workspace_id")) as DBWorkspace;
		if (!workspace.good()){
			response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
		}

		await workspace.reader().readName();
		await workspace.reader().readContent();

		await workspace.save();

		response.status(201).json(Code.success(`Update workspace successfully.`, {workspace: workspace.release()}));
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
		if (workspace_id.length != 24) {
			response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
		}

		const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
		if (!workspace.good()){
			response.status(200).json(Code.error(Code.INVALID_DATA));
		}

		await workspace.delete(session);

		await workspace.on().deleted(session);

		await session.commitTransaction();

		response.status(200).json(Code.success(`Delete workspace successfully`));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};

export const updateWorkspaceAccessList = async (request: Request, response: Response) => {
	logger.info("[Controller] Update workspace access list");

	try{
		const workspace_id = HTMLInput.param("workspace_id");
		if (workspace_id.length != 24) {
			response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
		}

		const workspace = await DBWorkspace.initialize(HTMLInput.param("workspace_id")) as DBWorkspace;
		if (!workspace.good()){
			response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
		}

		await workspace.reader().readUsers();

		await workspace.save();

		response.status(201).json(Code.success(`Update workspace members successfully.`, {workspace: workspace.release()}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};