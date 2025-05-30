import {Request, Response} from "express";
import {Code, HTMLInput} from "@ap/core";
import {DBFolder, DBFolderLoader} from "@dev/folder";
import mongoose from "mongoose";
import logger from "@utils/logger";
import {DBWorkspace} from "@dev/workspace";
import {DBRequest} from "@dev/request";
import {DBCollection} from "@dev/collection";
import {DBExample} from "@dev/example";

export const createNewFolder = async (request: Request, response: Response) => {
    logger.info("[Controller] Create new folder");

    try {
        const folder = await DBFolder.initialize() as DBFolder;

        await folder.reader().read();

        await folder.save();

        response.status(201).json(Code.success("Create new folder successfully!", {folder: folder.releaseCompact()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const deleteFolder = async (request: Request, response: Response) => {
    logger.info("[Controller] Delete folder");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const folder_id = HTMLInput.param("folder_id");
        if (folder_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const folder = await DBFolder.initialize(HTMLInput.param("folder_id")) as DBFolder;
        if (!folder.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
        }

        await folder.delete(session);

        await folder.on().deleted(session);

        await session.commitTransaction();
        response.status(201).json(Code.success("Delete folder successfully!"));
    } catch (error) {
        await session.abortTransaction();

        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    } finally {
        await session.endSession();
    }
};

export const duplicateFolder = async (request: Request, response: Response) => {
    logger.info("[Controller] Duplicate folder");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const folder_id = HTMLInput.param("folder_id");
        if (folder_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const old_folder = await DBFolder.initialize(HTMLInput.param("folder_id")) as DBFolder;
        if (!old_folder.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
        }

        const new_folder = await DBFolder.initialize() as DBFolder;

        await new_folder.reader().duplicate(old_folder);
        new_folder.object!.collection_id = old_folder.object!.collection_id;

        await new_folder.save(session);

        const {requests, examples} = await new_folder.on().duplicated(old_folder);
        await DBRequest.insertMany(requests.map(request => request.object!), session);
        await DBExample.insertMany(examples.map(example => example.object!), session);

        const requestsRelease = requests.map((request: DBRequest) => request.release());
        const examplesRelease = examples.map((example: DBExample) => example.release());

        await session.commitTransaction();
        response.status(201).json(Code.success("Duplicate folder successfully!", {
            folder: new_folder.release(),
            requests: requestsRelease,
            examples: examplesRelease
        }));
    } catch (error) {
        await session.abortTransaction();

        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    } finally {
        await session.endSession();
    }
};

export const getFoldersByWorkspace = async (request: Request, response: Response) => {
    logger.info("[Controller] Get folders by workspace");

    try {
        const workspace = await DBWorkspace.initialize(HTMLInput.query("workspace_id")) as DBWorkspace;
        if (!workspace.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
        }

        const folders = await DBFolderLoader.byWorkspace(workspace.object!);
        const folders_compact = folders.map(folder => folder.releaseCompact());

        response.status(200).json(Code.success("Get all folders successfully.", {folders: folders_compact}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const getFolderById = async (request: Request, response: Response) => {
    logger.info("[Controller] Get folder by id");

    try {
        const folder_id = HTMLInput.param("folder_id");
        if (folder_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const folder = await DBFolder.initialize(HTMLInput.param("folder_id")) as DBFolder;
        if (!folder.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
        }

        let collection = await DBCollection.initialize(folder.object!.collection_id) as DBCollection;

        response.status(200).json(Code.success("Get folder successfully.", {
            folder: folder.release(),
            collection: collection.release()
        }));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const moveFolder = async (request: Request, response: Response) => {

};

export const updateFolder = async (request: Request, response: Response) => {
    logger.info("[Controller] Update folder by id");

    try {
        const folder_id = HTMLInput.param("folder_id");
        if (folder_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const folder = await DBFolder.initialize(HTMLInput.param("folder_id")) as DBFolder;
        if (!folder.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
			return;
        }

        await folder.reader().read();

        await folder.save();

        response.status(200).json(Code.success("Update folder successfully.", {folder: folder.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const createNewRequestFromFolder = async (request: Request, response: Response) => {
    logger.info("[Controller] Create request from folder");

    try {
        const request = await DBRequest.initialize() as DBRequest;

        await request.reader().readFolder();

        await request.save();

        response.status(200).json(Code.success("Create new request successfully", {request: request.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};
