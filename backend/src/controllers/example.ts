import {Request, Response} from "express";
import logger from "@utils/logger";
import {Code, HTMLInput} from "@ap/core";
import {DBExample} from "@dev/example";
import {DBRequest} from "@dev/request";

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

};

export const duplicateExample = async (request: Request, response: Response) => {

};

export const getAllExamples = async (request: Request, response: Response) => {

};

export const getExampleById = async (request: Request, response: Response) => {

};

export const updateExampleName = async (request: Request, response: Response) => {

};

export const moveExample = async (request: Request, response: Response) => {

};