import {DBModel} from "@ap/db";
import WorkspaceModel from "@models/workspace";
import {DWorkspace} from "@db-schemas";
import {WorkspaceReader} from "@entities/workspace";

export default class DBWorkspace extends DBModel<DWorkspace>{
	protected _db = WorkspaceModel;

	constructor(){
		super();
		this._db = WorkspaceModel;
	}

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new WorkspaceReader(this._object);
	}
}