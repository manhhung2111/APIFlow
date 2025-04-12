import {Request, Response} from "express";
import logger from "@utils/logger";
import {Code, HTMLInput} from "@ap/core";
import {DBWorkspace} from "@dev/workspace";
import {DBPersona, DBPersonaLoader} from "@dev/persona";

export const createNewPersona = async (request: Request, response: Response) => {
    logger.info("[Controller] Create new persona");

    try {
        const persona = await DBPersona.initialize() as DBPersona;

        await persona.reader().read();

        await persona.save();

        response.status(201).json(Code.success("Create new persona successfully!", {persona: persona.releaseCompact()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const deletePersona = async (request: Request, response: Response) => {
    logger.info("[Controller] Delete persona");

    try {
        const persona_id = HTMLInput.param("persona_id");
        if (persona_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const persona = await DBPersona.initialize(HTMLInput.param("persona_id")) as DBPersona;
        if (!persona.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        await persona.delete();

        response.status(200).json(Code.success(`Delete persona successfully.`));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const duplicatePersona = async (request: Request, response: Response) => {
    logger.info("[Controller] Duplicate persona");

    try {
        const persona = await DBPersona.initialize(HTMLInput.param("persona_id")) as DBPersona;
        if (!persona.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const new_persona = await DBPersona.initialize() as DBPersona;

        new_persona.reader().duplicate(persona);

        await new_persona.save();

        response.status(201).json(Code.success(`Duplicate persona successfully.`, {persona: new_persona.releaseCompact()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const getPersonasByWorkspace = async (request: Request, response: Response) => {
    logger.info("[Controller] Get personas by workspace");

    try {
        const workspace = await DBWorkspace.initialize(HTMLInput.query("workspace_id")) as DBWorkspace;
        if (!workspace.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
        }

        const personas = await DBPersonaLoader.byWorkspace(workspace.object!);
        const personas_compact = personas.map(persona => persona.releaseCompact());

        response.status(200).json(Code.success("Get all personas successfully.", {personas: personas_compact}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const getPersonaById = async (request: Request, response: Response) => {
    logger.info("[Controller] Get persona by id");

    try {
        const persona_id = HTMLInput.param("persona_id");
        if (persona_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const persona = await DBPersona.initialize(HTMLInput.param("persona_id")) as DBPersona;

        if (!persona.good()) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        response.status(200).json(Code.success("Get persona successfully.", {persona: persona.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const updatePersona = async (request: Request, response: Response) => {
    logger.info("[Controller] Update persona");

    try {
        const persona_id = HTMLInput.param("persona_id");
        if (persona_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const persona = await DBPersona.initialize(HTMLInput.param("persona_id")) as DBPersona;

        persona.reader().readAuthentication();

        await persona.save();

        response.status(201).json(Code.success("Save persona successfully!", {persona: persona.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const updatePersonaName = async (request: Request, response: Response) => {
    logger.info("[Controller] Update persona name");

    try {
        const persona_id = HTMLInput.param("persona_id");
        if (persona_id.length != 24) {
            response.status(404).json(Code.error(Code.INVALID_DATA));
            return;
        }

        const persona = await DBPersona.initialize(HTMLInput.param("persona_id")) as DBPersona;

        persona.reader().readName();

        await persona.save();

        response.status(200).json(Code.success("Update persona name successfully!", {persona: persona.release()}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};