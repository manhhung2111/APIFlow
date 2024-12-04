import {DBModel} from "@ap/db";
import FolderModel from "@models/folder";
import {DFolder} from "@db-schemas";
import {FolderReader} from "@entities/folder";
import {Model} from "mongoose";

export default class DBFolder extends DBModel<DFolder>{
	protected _db: Model<DFolder> = FolderModel;

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