import {Request, Response} from "express";
import {Code, HTMLInput} from "@ap/core";
import {Workspace} from "@entities/workspace";
import mongoose from "mongoose";
import {Collection} from "@entities/collection";
import {Folder} from "@entities/folder";
import {Request as DBRequest} from "@entities/request";
import {DBCondition} from "@ap/db";
import {Example} from "@entities/example";
import {Environment} from "@entities/environment";

export const getAllWorkspaces = async (request: Request, response: Response) => {

};

export const getWorkspaceById = async (request: Request, response: Response) => {

};

export const createNewWorkspace = async (request: Request, response: Response) => {

};

export const updateWorkspaceName = async (request: Request, response: Response) => {

};

export const updateWorkspaceContent = async (request: Request, response: Response) => {

};

export const deleteWorkspace = async (request: Request, response: Response) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const workspace_id = HTMLInput.param("workspace_id");
		if (!workspace_id){
			throw new Code(Code.INVALID_DATA);
		}

		const workspace = new Workspace();
		await workspace.initialize(workspace_id);
		if (!workspace.good()){
			throw new Code(Code.INVALID_DATA);
		}

		let sc = new DBCondition().setFilter({workspace_id: workspace_id});

		const collection = new Collection();
		await collection.deleteMany(sc, session);

		const folder = new Folder();
		await folder.deleteMany(sc, session);

		const request = new DBRequest();
		await request.deleteMany(sc, session);

		const example = new Example();
		await example.deleteMany(sc, session);

		const environment = new Environment();
		await environment.deleteMany(sc, session);

		await workspace.delete();

		await session.commitTransaction();
		response.status(204).json(Code.success(`Delete workspace \"${workspace._object?.name}\" successfully.`));
	} catch (error){
		await session.abortTransaction();

		if (error instanceof Error){
			console.error(error.stack);
			response.status(500).json(Code.error(error.message));
			return;
		}
		response.status(500).json(Code.error(Code.UNKNOWN_ERROR));
	} finally{
		await session.endSession();
	}
};