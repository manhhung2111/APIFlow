import {Request, Response} from "express";
import logger from "@utils/logger";
import {DBCollection, DBCollectionLoader} from "@dev/collection";
import {Code, HTMLInput} from "@ap/core";
import {DBEnvironment, DBEnvironmentLoader} from "@dev/environment";
import mongoose from "mongoose";
import {DBRequest} from "@dev/request";
import {DBWorkspace} from "@dev/workspace";

export const createNewEnvironment = async (request: Request, response: Response) => {
    logger.info("[Controller] Create new environment");

    try{
        const environment = await DBEnvironment.initialize() as DBEnvironment;

        await environment.reader().read();

        await environment.save();

        response.status(201).json(Code.success("Create new environment successfully!", {environment: environment.releaseCompact()}));
    } catch (error){
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const deleteEnvironment = async (request: Request, response: Response) => {
    logger.info("[Controller] Delete environment");

    try{
        const environment = await DBEnvironment.initialize(HTMLInput.param("environment_id")) as DBEnvironment;
        if (!environment.good()){
            response.status(204).json(Code.error(Code.INVALID_DATA));
        }

        await environment.delete();

        response.status(204).json(Code.success(`Delete environment \"${environment.getField("name")}\" successfully.`));
    } catch (error){
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const duplicateEnvironment = async (request: Request, response: Response) => {
    logger.info("[Controller] Delete environment");

    try{
        const environment = await DBEnvironment.initialize(HTMLInput.inputInline("environment_id")) as DBEnvironment;
        if (!environment.good()){
            response.status(204).json(Code.error(Code.INVALID_DATA));
        }

        const new_env = await DBEnvironment.initialize() as DBEnvironment;

        new_env.reader().duplicate(environment);

        await new_env.save();

        response.status(204).json(Code.success(`Duplicate environment \"${environment.getField("name")}\" successfully.`));
    } catch (error){
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const getEnvironmentsByWorkspace = async (request: Request, response: Response) => {
    logger.info("[Controller] Get environments by workspace");

    try{
        const workspace = await DBWorkspace.initialize(HTMLInput.query("workspace_id")) as DBWorkspace;
        if (!workspace.good()){
            response.status(204).json(Code.error(Code.INVALID_DATA));
        }

        const environments = await DBEnvironmentLoader.byWorkspace(workspace.object!);
        const environments_compact = environments.map(environment => environment.releaseCompact());

        response.status(200).json(Code.success("Get all collections successfully.", {environments: environments_compact}));
    } catch (error){
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const getEnvironmentById = async (request: Request, response: Response) => {
    logger.info("[Controller] Get environment by id");

    try{
        const environment = await DBEnvironment.initialize(HTMLInput.param("environment_id")) as DBEnvironment;

        if (!environment.good()){
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        response.status(200).json(Code.success("Get environment successfully.", {environment: environment.release()}));
    } catch (error){
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const updateEnvironment = async (request: Request, response: Response) => {
    logger.info("[Controller] Update environment");

    try{
        const environment = await DBEnvironment.initialize(HTMLInput.param("environment_id")) as DBEnvironment;

        environment.reader().readVariables();

        await environment.save();

        response.status(201).json(Code.success("Save environment successfully!", {environment: environment.release()}));
    } catch (error){
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const updateEnvironmentName = async (request: Request, response: Response) => {

};