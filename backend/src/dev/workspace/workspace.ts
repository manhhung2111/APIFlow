import {DBModel} from "@ap/db";
import WorkspaceModel from "@models/workspace";
import {DWorkspace} from "@db-schemas";
import {DBWorkspaceReader, DBWorkspaceUserACL} from "@dev/workspace";
import {Model} from "mongoose";

export default class DBWorkspace extends DBModel<DWorkspace>{
	protected _db: Model<DWorkspace> = WorkspaceModel;

	release(): object{
		return this.export(["name", "content", "created_at", "updated_at"]);
	}

	releaseCompact(): object{
		return this.export(["name", "content"]);
	}

	reader(){
		return new DBWorkspaceReader(this._object);
	}

	acl(user_id: string = ""){
		return new DBWorkspaceUserACL(this._object, user_id);
	}
}