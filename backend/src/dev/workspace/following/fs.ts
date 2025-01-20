import {DBComp} from "@ap/db";
import {DWorkspace} from "@db-schemas";
import {DBWorkspaceFollowing} from "@dev/workspace";
import {ClientSession, HydratedDocument} from "mongoose";

export default class DBWorkspaceFollowingService extends DBComp<DWorkspace>{
	constructor(obj: HydratedDocument<DWorkspace> | null | undefined){
		super(obj);
	}

	public async setFollowing(session: ClientSession | null = null){
		const viewers = this.getViewers();

		await DBWorkspaceFollowing.setFollowing(this._obj, viewers, session);
	}

	public async updateFollowing(session: ClientSession | null = null){
		const viewers = this.getViewers();

		await DBWorkspaceFollowing.setFollowing(this._obj, viewers, session, true);
	}

	public async resetFollowing(session: ClientSession | null = null){
		const viewers = this.getViewers();

		await DBWorkspaceFollowing.resetFollowing(this._obj, viewers, session);
	}

	public async removeFollowing(session: ClientSession | null = null){
		await DBWorkspaceFollowing.removeFollowing(this._obj, session);
	}

	private getViewers(){
		const viewers = this._obj?.viewers.map(user_id => user_id.toString()) || [];
		const commenters = this._obj?.commenters.map(user_id => user_id.toString()) || [];
		const editors = this._obj?.editors.map(user_id => user_id.toString()) || [];

		return [...new Set([...viewers, ...commenters, ...editors])];
	}
}