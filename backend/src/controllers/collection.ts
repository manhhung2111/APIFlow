import {Request, Response} from "express";
import logger from "@utils/logger";
import {Code, HTMLInput, Word} from "@ap/core";
import {DBCollection, DBCollectionImporter, DBCollectionLoader} from "@dev/collection";
import mongoose from "mongoose";
import {DBWorkspace} from "@dev/workspace";
import {DBRequest, DBRequestLoader} from "@dev/request";
import {DBFolder, DBFolderLoader} from "@dev/folder";
import {DBExample, DBExampleLoader} from "@dev/example";
import HuggingFaceEmbeddingService from "@services/ai/hugging.face";
import GoogleGeminiService from "@services/ai/google.gemini";

export const createNewCollection = async (request: Request, response: Response) => {
    logger.info("[Controller] Create new collection");

    try {
        const collection = await DBCollection.initialize() as DBCollection;

        collection.reader().read();

        await collection.save();

        response.status(201).json(Code.success("Create new collection successfully!", {collection: collection.releaseCompact()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const deleteCollection = async (request: Request, response: Response) => {
    logger.info("[Controller] Delete collection");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collection = await DBCollection.initialize(collection_id) as DBCollection;
        if (!collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        await collection.delete(session);

        await collection.on().deleted(session);

        await session.commitTransaction();
        response.status(201).json(Code.success("Delete collection successfully!"));
    } catch (error) {
        await session.abortTransaction();

        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    } finally {
        await session.endSession();
    }
};

export const duplicateCollection = async (request: Request, response: Response) => {
    logger.info("[Controller] Duplicate collection");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const old_collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
        if (!old_collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const new_collection = await DBCollection.initialize() as DBCollection;

        await new_collection.reader().duplicate(old_collection);

        await new_collection.save(session);

        const {folders, requests, examples} = await new_collection.on().duplicated(old_collection);

        await DBFolder.insertMany(folders.map(folder => folder.object!), session);
        await DBRequest.insertMany(requests.map(request => request.object!), session);
        await DBExample.insertMany(examples.map(example => example.object!), session);

        const foldersRelease = folders.map((folder: DBFolder) => folder.release());
        const requestsRelease = requests.map((request: DBRequest) => request.release());
        const examplesRelease = examples.map((example: DBExample) => example.release());

        await session.commitTransaction();
        response.status(201).json(Code.success("Duplicate collection successfully!", {
            collection: new_collection.release(),
            folders: foldersRelease,
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

export const getCollectionsByWorkspace = async (request: Request, response: Response) => {
    logger.info("[Controller] Get collections by workspace");

    try {
        const workspace = await DBWorkspace.initialize(HTMLInput.query("workspace_id")) as DBWorkspace;
        if (!workspace.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collections = await DBCollectionLoader.byWorkspace(workspace.object!);
        const collections_compact = collections.map(collection => collection.releaseCompact());

        response.status(200).json(Code.success("Get all collections successfully.", {collections: collections_compact}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const getCollectionById = async (request: Request, response: Response) => {
    logger.info("[Controller] Get collection by id");

    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;

        if (!collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        response.status(200).json(Code.success("Get collection successfully.", {collection: collection.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const updateCollection = async (request: Request, response: Response) => {
    logger.info("[Controller] Update collection");

    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
        if (!collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        collection.reader().read();

        await collection.save();

        response.status(200).json(Code.success("Save collection successfully", {collection: collection.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const updateCollectionContent = async (request: Request, response: Response) => {
    logger.info("[Controller] Update collection content");

    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
        if (!collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        await collection.reader().readContent();

        await collection.save();

        response.status(200).json(Code.success("Update collection content successfully", {collection: collection.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const updateCollectionName = async (request: Request, response: Response) => {
    logger.info("[Controller] Update collection name");

    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
        if (!collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        await collection.reader().readName();

        await collection.save();

        response.status(200).json(Code.success("Update collection name successfully", {collection: collection.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const createNewRequestFromCollection = async (request: Request, response: Response) => {
    logger.info("[Controller] Create new request from collection");

    try {
        const request = await DBRequest.initialize() as DBRequest;

        await request.reader().readCollection();

        await request.save();

        response.status(200).json(Code.success("Create new request successfully", {request: request.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const getCollectionAssociatedWithData = async (request: Request, response: Response) => {
    logger.info("[Controller] Get collection associated with data");

    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
        if (!collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const folders = await DBFolderLoader.byCollection(collection.object!);
        const requests = await DBRequestLoader.byCollection(collection.object!);
        const examples = await DBExampleLoader.byCollection(collection.object!);

        const folders_release = folders.map(folder => folder.release());
        const requests_release = requests.map(request => request.release());
        const examples_release = examples.map(example => example.release());

        response.status(200).json(Code.success("Get collection successfully.", {
            collection: collection.release(),
            folders: folders_release,
            requests: requests_release,
            examples: examples_release,
        }));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const getCollectionExport = async (request: Request, response: Response) => {
    logger.info("[Controller] Get collection associated with data");

    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
        if (!collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collectionExport = await collection.exporter().exportPostman();

        response.status(200).json(Code.success("Export collection successfully.", {
            collection_export: collectionExport
        }));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const importCollection = async (request: Request, response: Response) => {
    logger.info("[Controller] Import collection associated with data");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const file = HTMLInput.inputFile("file")[0];

        try {
            const data = JSON.parse(file.buffer.toString("utf8"));

            const {
                collection,
                folders,
                requests,
                examples
            } = await DBCollectionImporter.importCollection(data, session);

            await session.commitTransaction();
            response.status(201).json(Code.success("Import collection successfully", {
                collection,
                folders,
                requests,
                examples
            }));
        } catch (error) {
            throw new Error("We don’t recognize/support this format.");
        }
    } catch (error) {
        await session.abortTransaction();
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    } finally {
        await session.endSession();
    }
}

export const embedRequests = async (request: Request, response: Response) => {
    logger.info("[Controller] Embed requests");
    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
        if (!collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const requests = await DBRequestLoader.byCollection(collection.object!);
        for (let request of requests) {
            if (request.object!.embedding && request.object!.embedding.length > 0) {
                continue;
            }
            const text = `Name: ${request.object!.name}. Description: ${request.object!.content}.`
            request.object!.embedding = await HuggingFaceEmbeddingService.embedText(text);

            await request.save();
        }

        response.status(200).json(Code.success(`Embed ${requests.length} requests successfully.`))
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
}

export const searchRequests = async (request: Request, response: Response) => {
    logger.info("[Controller] Vector Search requests");
    try {
        const collection_id = HTMLInput.param("collection_id");
        if (collection_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const collection = await DBCollection.initialize(HTMLInput.param("collection_id")) as DBCollection;
        if (!collection.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const query = HTMLInput.query("query");
        let result = await GoogleGeminiService.classifyQuery(query);
        result = Word.removeNewLines(result);

        let answer = "Your query isn't related to API navigation or summaries. Try asking:  \n" +
            "\n" +
            "- *\"Summarize the API collection.\"*  \n" +
            "- *\"Get details for the login request.\"*    \n" +
            "Let me know how I can help! 😊"

        if (result == "Summarize") {

        } else if (result == "Retrieve a request") {
            let request = await DBRequest.searchVector(query);

            let context = "{}";
            if (request != null) {
                request["link"] = `#request-${request._id}`;
                context = JSON.stringify(request);
            }

            answer = await GoogleGeminiService.retrieve(context, query);
        }


        response.status(200).json(Code.success(`Search request successfully.`, {
            request: answer ?? "No document" +
                " found"
        }));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
}