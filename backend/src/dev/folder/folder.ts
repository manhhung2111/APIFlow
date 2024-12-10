import {DBModel} from "@ap/db";
import FolderModel from "@models/folder";
import {DFolder} from "@db-schemas";
import {DBFolderListener, DBFolderReader} from "@dev/folder";
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
		return new DBFolderReader(this.object);
	}

	on(){
		return new DBFolderListener(this.object);
	}
}