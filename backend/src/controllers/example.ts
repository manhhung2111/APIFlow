import {Request, Response} from "express";
import logger from "@utils/logger";
import {Code, HTMLInput} from "@ap/core";
import {DBExample} from "@dev/example";
import {DBRequest} from "@dev/request";
import {DBFolder} from "@dev/folder";
import {DBCollection} from "@dev/collection";

export const createNewExampleFromRequest = async (request: Request, response: Response) => {
    logger.info("[Controller] Create new example from request");
    try {
        const example = await DBExample.initialize() as DBExample;

        const request = await DBRequest.initialize(HTMLInput.inputInline("request_id")) as DBRequest;
        if (!request.good()) {
            response.status(404).json(Code.success("Request not found"));
        }

        await example.reader().readRequest(request);

        await example.save();

        response.status(201).json(Code.success("Add example successfully!", {example: example.releaseCompact()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const createNewExampleFromResponse = async (request: Request, response: Response) => {
    logger.info("[Controller] Create new example from response");
    try {
        const example = await DBExample.initialize() as DBExample;

        await example.reader().readResponse();

        await example.save();

        response.status(201).json(Code.success("Save example from response successfully!", {example: example.releaseCompact()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const deleteExample = async (request: Request, response: Response) => {
    logger.info("[Controller] Delete an example");
    try {
        const example = await DBExample.initialize(HTMLInput.param("example_id")) as DBExample;
        if (!example.good()){
            response.status(404).json(Code.error(Code.INVALID_DATA));
        }

        await example.delete();

        response.status(200).json(Code.success(`Delete example "${example.object!.name}" successfully`));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const duplicateExample = async (request: Request, response: Response) => {

};

export const getAllExamples = async (request: Request, response: Response) => {

};

export const getExampleById = async (request: Request, response: Response) => {
    logger.info("[Controller] Get example by id");

    try {
        const example = await DBExample.initialize(HTMLInput.param("example_id")) as DBExample;
        if (!example.good()) {
            response.status(400).json(Code.error(Code.INVALID_DATA));
        }

        let request = await DBRequest.initialize(example.object!.request_id) as DBRequest;

        let folder = null;
        if (example.object?.folder_id) {
            folder = await DBFolder.initialize(example.object.folder_id) as DBFolder;
        }

        let collection = await DBCollection.initialize(example.object!.collection_id) as DBCollection;

        response.status(200).json(Code.success(`Get example with id = ${request.getField("_id")} successfully`, {
            request: request.release(),
            folder: folder?.release(),
            collection: collection?.release(),
            example: example.release(),
        }));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const updateExampleName = async (request: Request, response: Response) => {
    logger.info("[Controller] Update example from response");
    try {
        const example = await DBExample.initialize(HTMLInput.param("example_id")) as DBExample;

        await example.reader().readName();

        await example.save();

        response.status(201).json(Code.success("Save example name successfully!", {example: example.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const moveExample = async (request: Request, response: Response) => {

};

export const updateExample = async (request: Request, response: Response) => {
    logger.info("[Controller] Update example from response");
    try {
        const example = await DBExample.initialize(HTMLInput.param("example_id")) as DBExample;

        await example.reader().read();

        await example.save();

        response.status(201).json(Code.success("Save example successfully!", {example: example.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

