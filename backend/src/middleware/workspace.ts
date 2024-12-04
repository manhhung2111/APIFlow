import {NextFunction, Request, Response} from "express";
import {Workspace} from "@entities/workspace";
import {Code, HTMLInput} from "@ap/core";

const createWorkspaceMiddleware = (checkPermission: (workspace: Workspace, user_id: string) => boolean) =>
	async (request: Request, response: Response, next: NextFunction) => {
		const {user_id} = response.locals.user;
		const workspace_id = HTMLInput.param("workspace_id");

		if (!user_id || !workspace_id){
			response.status(400).json(Code.error("Invalid data"));
			return;
		}

		const workspace = new Workspace();
		await workspace.initialize(workspace_id);

		if (!workspace.good()){
			response.status(400).json(Code.error("Invalid workspace"));
			return;
		}

		if (!checkPermission(workspace, user_id)){
			response.status(403).json(Code.error(Code.INVALID_AUTHORIZATION));
			return;
		}

		next();
	};

export const workspaceViewable = createWorkspaceMiddleware((workspace, user_id) =>
	workspace.acl(user_id).canView(),
);

export const workspaceCommentable = createWorkspaceMiddleware((workspace, user_id) =>
	workspace.acl(user_id).canComment(),
);

export const workspaceEditable = createWorkspaceMiddleware((workspace, user_id) =>
	workspace.acl(user_id).canEdit(),
);

export const workspaceAdmin = createWorkspaceMiddleware((workspace, user_id) =>
	workspace.acl(user_id).isAdmin(),
);