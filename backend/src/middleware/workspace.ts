import {NextFunction, Request, Response} from "express";
import {DBWorkspace} from "@dev/workspace";
import {Code, HTMLInput} from "@ap/core";

const createWorkspaceMiddleware = (checkPermission: (workspace: DBWorkspace) => boolean) =>
	async (request: Request, response: Response, next: NextFunction) => {
		try{
			const workspace_id = HTMLInput.param("workspace_id");

			if (!workspace_id){
				response.status(400).json(Code.error("Invalid data"));
				return;
			}

			const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
			if (!workspace.good()){
				response.status(400).json(Code.error("Invalid workspace"));
				return;
			}

			if (!checkPermission(workspace)){
				response.status(403).json(Code.error(Code.INVALID_AUTHORIZATION));
				return;
			}

			return next();
		} catch (error){
			response.status(500).json(Code.error((error as Error).message));
		}
	};

export const workspaceViewable = createWorkspaceMiddleware((workspace) =>
	workspace.acl().canView(),
);

export const workspaceCommentable = createWorkspaceMiddleware((workspace) =>
	workspace.acl().canComment(),
);

export const workspaceEditable = createWorkspaceMiddleware((workspace) =>
	workspace.acl().canEdit(),
);

export const workspaceAdmin = createWorkspaceMiddleware((workspace) =>
	workspace.acl().isAdmin(),
);