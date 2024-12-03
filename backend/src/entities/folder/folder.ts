import {DBModel} from "@ap/db";
import FolderModel from "@models/folder";
import {DFolder} from "@db-schemas";
import {FolderReader} from "@entities/folder";

export default class DBFolder extends DBModel<DFolder>{
	protected _db = FolderModel;

	constructor(){
		super();
		this._db = FolderModel;
	}

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new FolderReader(this._object);
	}
}