import {Request, Response} from "express";
import logger from "@utils/logger";
import {DBCollection} from "@dev/collection";
import {Code} from "@ap/core";
import {DBEnvironment} from "@dev/environment";

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

};

export const duplicateEnvironment = async (request: Request, response: Response) => {

};

export const getAllEnvironments = async (request: Request, response: Response) => {

};

export const getEnvironmentById = async (request: Request, response: Response) => {

};

export const updateEnvironment = async (request: Request, response: Response) => {

};

export const updateEnvironmentName = async (request: Request, response: Response) => {

};