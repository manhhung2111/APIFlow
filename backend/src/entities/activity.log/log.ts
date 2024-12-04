import {DBModel} from "@ap/db";
import ActivityLogModel from "@models/activity.log";
import {DActivityLog} from "@db-schemas";
import {ActivityLogReader} from "@entities/activity.log";
import {Model} from "mongoose";

export default class DBActivityLog extends DBModel<DActivityLog>{
	protected _db: Model<DActivityLog> = ActivityLogModel;

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new ActivityLogReader(this._object);
	}

}