import {DBModel} from "@ap/db";
import RequestModel from "@models/request";
import {DRequest} from "@db-schemas";
import {DBRequestListener, DBRequestReader} from "@dev/request";
import {Model} from "mongoose";

export default class DBRequest extends DBModel<DRequest>{
	protected _db: Model<DRequest> = RequestModel;

	release(): object{
		return this.export(["_id", "user_id", "workspace_id", "collection_id", "folder_id", "name",
			"content", "method", "url", "params", "headers", "authorization", "body", "scripts",
			"tag", "data", "token", "created_at", "updated_at"]);
	}

	releaseCompact(): object{
		return this.export(["_id", "user_id", "workspace_id", "collection_id", "folder_id", "name",
			"content", "method", "created_at", "updated_at"]);
	}

	reader(){
		return new DBRequestReader(this.object);
	}

	on(){
		return new DBRequestListener(this.object);
	}
}