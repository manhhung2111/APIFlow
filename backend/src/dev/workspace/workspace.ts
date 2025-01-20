import {DBModel} from "@ap/db";
import WorkspaceModel from "@models/workspace";
import {DWorkspace} from "@db-schemas";
import {DBWorkspaceFollowingService, DBWorkspaceListener, DBWorkspaceReader, DBWorkspaceUserACL} from "@dev/workspace";
import {Model} from "mongoose";

export default class DBWorkspace extends DBModel<DWorkspace>{
	protected _db: Model<DWorkspace> = WorkspaceModel;

	release() {
		let obj = this.export(["user_id", "name", "content", "viewers", "commenters", "editors", "data", "token", "created_at", "updated_at"]);
		obj["can"] = this.acl().release();

		return obj;
	}

	releaseCompact(): object{
		return this.export(["user_id", "name", "content", "viewers", "commenters", "editors", "created_at", "updated_at"]);
	}

	reader(){
		return new DBWorkspaceReader(this.object);
	}

	acl(user_id: string = ""){
		return new DBWorkspaceUserACL(this.object, user_id);
	}

	on(){
		return new DBWorkspaceListener(this.object);
	}

	fs(){
		return new DBWorkspaceFollowingService(this.object);
	}
}