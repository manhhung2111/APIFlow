import {DBFollowing} from "@ap/db";
import {DWorkspaceFollowing} from "@db-schemas";
import WorkspaceFollowingModel from "@models/workspace.following";
import {Model} from "mongoose";

export default class WorkspaceFollowing extends DBFollowing<DWorkspaceFollowing>{
	protected _db: Model<DWorkspaceFollowing> = WorkspaceFollowingModel;

	release(): object{
		return this.export([""]);
	}
}