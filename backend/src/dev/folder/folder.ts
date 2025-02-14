import {DBModel} from "@ap/db";
import FolderModel from "@models/folder";
import {DFolder} from "@db-schemas";
import {DBFolderListener, DBFolderReader} from "@dev/folder";
import {Model} from "mongoose";

export default class DBFolder extends DBModel<DFolder>{
	protected _db: Model<DFolder> = FolderModel;

	release(): object{
		return this.export(["_id", "user_id", "workspace_id", "collection_id", "name", "content",
			"data", "token", "created_at", "updated_at"]);
	}

	releaseCompact(): object{
		return this.export(["_id", "user_id", "workspace_id", "collection_id", "name",
			"content", "created_at", "updated_at"]);
	}

	reader(){
		return new DBFolderReader(this.object);
	}

	on(){
		return new DBFolderListener(this.object);
	}
}