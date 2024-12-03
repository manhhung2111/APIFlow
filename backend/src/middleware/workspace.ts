import {NextFunction, Request, Response} from "express";

export const workspaceViewable = async (request: Request, response: Response, next: NextFunction) => {
	const {_id} = response.locals.user;
	const {workspace_id} = request.body;

	/**
	 * TODO: Load document from WorkspaceFollowing collection to check permission
	 * if (!acl?.viewable) {
	 *     response.status(403).json({
	 *       ...Code.error("You don't have permission to access this resource"),
	 *     });
	 *   }
	 */

	next();
};

export const workspaceCommentable = async (request: Request, response: Response, next: NextFunction) => {
	const {_id} = response.locals.user;
	const {workspace_id} = request.body;

	/**
	 * TODO: Load document from WorkspaceFollowing collection to check permission
	 * if (!acl?.commentable) {
	 *     response.status(403).json({
	 *       ...Code.error("You don't have permission to access this resource"),
	 *     });
	 *   }
	 */

	next();
};

export const workspaceEditable = async (request: Request, response: Response, next: NextFunction) => {
	const {_id} = response.locals.user;
	const {workspace_id} = request.body;

	/**
	 * TODO: Load document from WorkspaceFollowing collection to check permission
	 * if (!acl?.editable) {
	 *     response.status(403).json({
	 *       ...Code.error("You don't have permission to access this resource"),
	 *     });
	 *   }
	 */

	next();
};

export const workspaceAdmin = async (request: Request, response: Response, next: NextFunction) => {
	const {_id} = response.locals.user;
	const {workspace_id} = request.body;

	/**
	 * TODO: Load document from WorkspaceFollowing collection to check permission
	 * if (!acl?.full_access) {
	 *     response.status(403).json({
	 *       ...Code.error("You don't have permission to access this resource"),
	 *     });
	 *   }
	 */

	next();
};
