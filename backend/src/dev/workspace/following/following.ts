import {DBCondition, DBFollowing} from "@ap/db";
import {DUser, DWorkspace, DWorkspaceFollowing} from "@db-schemas";
import WorkspaceFollowingModel from "@models/workspace.following";
import {HydratedDocument, Model} from "mongoose";
import UUID from "@utils/uuid";

export default class WorkspaceFollowing extends DBFollowing<DWorkspaceFollowing>{
	protected _db: Model<DWorkspaceFollowing> = WorkspaceFollowingModel;

	release(){
		return this.export(["_id", "user_id", "creator_id", "workspace_id", "name", "content", "viewing", "commenting", "editing", "viewers", "commenters", "editors", "token"]);
	}


	getExport(workspace: HydratedDocument<DWorkspace>, user: HydratedDocument<DUser>){
		const workspace_admin = workspace.user_id == user._id;
		const editing = workspace.editors.includes(user._id) || workspace_admin;
		const commenting = workspace.commenters.includes(user._id) || editing || workspace_admin;
		const viewing = workspace.viewers.includes(user._id) || commenting || editing || workspace_admin;

		return {
			"user_id": user._id,
			"creator_id": workspace.user_id,
			"object_id": workspace._id,
			"name": workspace.name,
			"content": workspace.content,
			"viewing": viewing,
			"commenting": commenting,
			"editing": editing,
			"viewers": workspace.viewers,
			"commenters": workspace.commenters,
			"editors": workspace.editors,
		};
	}


}