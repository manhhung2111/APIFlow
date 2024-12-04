import {DBModel} from "@ap/db";
import WorkspaceModel from "@models/workspace";
import {DWorkspace} from "@db-schemas";
import {WorkspaceReader, WorkspaceUserACL} from "@entities/workspace";
import {Model} from "mongoose";

export default class DBWorkspace extends DBModel<DWorkspace>{
	protected _db: Model<DWorkspace> = WorkspaceModel;

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new WorkspaceReader(this._object);
	}

	acl(user_id: string) {
		return new WorkspaceUserACL(this._object, user_id);
	}
}