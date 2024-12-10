import {Request, Response} from "express";
import {Code, HTMLInput} from "@ap/core";
import {DBFolder, DBFolderLoader} from "@dev/folder";
import mongoose from "mongoose";
import logger from "@utils/logger";
import {DBWorkspace} from "@dev/workspace";

export const createNewFolder = async (request: Request, response: Response) => {
	logger.info("[Controller] Create new folder");

	try{
		const folder = await DBFolder.initialize() as DBFolder;

		await folder.reader().read();

		await folder.save();

		response.status(201).json(Code.success("Create new folder successfully!"));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const deleteFolder = async (request: Request, response: Response) => {
	logger.info("[Controller] Delete folder");

	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const folder = await DBFolder.initialize(HTMLInput.param("folder_id")) as DBFolder;
		if (!folder.good()){
			response.status(400).json(Code.error(Code.INVALID_DATA));
		}

		await folder.delete(session);

		await folder.on().deleted(session);

		await session.commitTransaction();
		response.status(201).json(Code.success("Delete folder successfully!"));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};

export const duplicateFolder = async (request: Request, response: Response) => {
	logger.info("[Controller] Duplicate folder");

	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const old_folder = await DBFolder.initialize(HTMLInput.param("folder_id")) as DBFolder;
		if (!old_folder.good()){
			response.status(400).json(Code.error(Code.INVALID_DATA));
		}

		const new_folder = await DBFolder.initialize() as DBFolder;

		await new_folder.reader().duplicate(old_folder);

		await new_folder.save(session);

		await new_folder.on().duplicated(old_folder, session);

		await session.commitTransaction();
		response.status(201).json(Code.success("Duplicate folder successfully!"));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};

export const getFoldersByWorkspace = async (request: Request, response: Response) => {
	logger.info("[Controller] Get folders by workspace");

	try{
		const workspace = await DBWorkspace.initialize(HTMLInput.param("workspace_id")) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		const folders = await DBFolderLoader.byWorkspace(workspace.object!);
		const folders_compact = folders.map(folder => folder.releaseCompact());

		response.status(200).json(Code.success("Get all folders successfully.", {folders: folders_compact}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const getFolderById = async (request: Request, response: Response) => {
	logger.info("[Controller] Get folder by id");

	try{
		const folder = await DBFolder.initialize(HTMLInput.param("folder_id")) as DBFolder;
		if (!folder.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		response.status(200).json(Code.success("Get folder successfully.", {folder: folder.release()}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const moveFolder = async (request: Request, response: Response) => {

};

export const updateFolder = async (request: Request, response: Response) => {

};
export const updateFolderContent = async (request: Request, response: Response) => {
	logger.info("[Controller] Update folder content");

	try{
		const folder = await DBFolder.initialize(HTMLInput.param("folder_id")) as DBFolder;
		if (!folder.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await folder.reader().readContent();

		await folder.save();

		response.status(200).json(Code.success("Update folder content successfully", {folder: folder.release()}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateFolderName = async (request: Request, response: Response) => {
	logger.info("[Controller] Update folder name");

	try{
		const folder = await DBFolder.initialize(HTMLInput.param("folder_id")) as DBFolder;
		if (!folder.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await folder.reader().readName();

		await folder.save();

		response.status(200).json(Code.success("Update folder name successfully", {folders: folder.release()}));
	} catch (error){
		logger.error((error as Error).message);
		response.status(500).json(Code.error((error as Error).message));
	}
};
