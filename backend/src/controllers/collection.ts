import {Request, Response} from "express";
import logger from "@utils/logger";
import {Code, HTMLInput} from "@ap/core";
import {DBCollection, DBCollectionLoader} from "@dev/collection";
import mongoose from "mongoose";
import {DBWorkspace} from "@dev/workspace";

export const createNewCollection = async (request: Request, response: Response) => {
	logger.info("[Controller] Create new collection");

	try{
		const collection = await DBCollection.initialize() as DBCollection;

		collection.reader().read();

		await collection.save();

		response.status(201).json(Code.success("Create new collection successfully!", {collection: collection.releaseCompact()}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const deleteCollection = async (request: Request, response: Response) => {
	logger.info("[Controller] Delete collection");

	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
		if (!collection.good()){
			response.status(400).json(Code.error(Code.INVALID_DATA));
		}

		await collection.delete(session);

		await collection.on().deleted(session);

		await session.commitTransaction();
		response.status(201).json(Code.success("Create new folder successfully!"));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};

export const duplicateCollection = async (request: Request, response: Response) => {
	logger.info("[Controller] Duplicate collection");

	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const old_collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
		if (!old_collection.good()){
			response.status(400).json(Code.error(Code.INVALID_DATA));
		}

		const new_collection = await DBCollection.initialize() as DBCollection;

		await new_collection.reader().duplicate();

		await new_collection.save(session);

		await new_collection.on().duplicated(old_collection, session);

		await session.commitTransaction();
		response.status(201).json(Code.success("Duplicate collection successfully!"));
	} catch (error){
		await session.abortTransaction();

		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	} finally{
		await session.endSession();
	}
};

export const getCollectionsByWorkspace = async (request: Request, response: Response) => {
	logger.info("[Controller] Get collections by workspace");

	try{
		const workspace = await DBWorkspace.initialize(HTMLInput.query("workspace_id")) as DBWorkspace;
		if (!workspace.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		const collections = await DBCollectionLoader.byWorkspace(workspace.object!);
		const collections_compact = collections.map(collection => collection.releaseCompact());

		response.status(200).json(Code.success("Get all collections successfully.", {collections: collections_compact}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const getCollectionById = async (request: Request, response: Response) => {
	logger.info("[Controller] Get collection by id");

	try{
		const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
		if (!collection.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		response.status(200).json(Code.success("Get collection successfully.", {collection: collection.release()}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateCollection = async (request: Request, response: Response) => {

};
export const updateCollectionContent = async (request: Request, response: Response) => {
	logger.info("[Controller] Update collection content");

	try{
		const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
		if (!collection.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await collection.reader().readContent();

		await collection.save();

		response.status(200).json(Code.success("Update collection content successfully", {collection: collection.release()}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};

export const updateCollectionName = async (request: Request, response: Response) => {
	logger.info("[Controller] Update collection name");

	try{
		const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
		if (!collection.good()){
			response.status(204).json(Code.error(Code.INVALID_DATA));
		}

		await collection.reader().readName();

		await collection.save();

		response.status(200).json(Code.success("Update collection name successfully", {collection: collection.release()}));
	} catch (error){
		logger.error((error as Error).stack);
		response.status(500).json(Code.error((error as Error).message));
	}
};
