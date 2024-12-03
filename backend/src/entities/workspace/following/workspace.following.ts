import {DBFollowing} from "@ap/db";
import {DWorkspaceFollowing} from "@db-schemas";
import WorkspaceFollowingModel from "@models/workspace.following";

export default class WorkspaceFollowing extends DBFollowing<DWorkspaceFollowing>{
	protected _db = WorkspaceFollowingModel;

	constructor(){
		super();
		this._db = WorkspaceFollowingModel;
	}

	release(): object{
		return this.export([""]);
	}
}