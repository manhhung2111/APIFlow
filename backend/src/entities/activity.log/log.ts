import {DBModel} from "@ap/db";
import ActivityLogModel from "@models/activity.log";
import {DActivityLog} from "@db-schemas";
import {ActivityLogReader} from "@entities/activity.log";

export default class DBCollection extends DBModel<DActivityLog>{
	protected _db = ActivityLogModel;

	constructor(){
		super();
		this._db = ActivityLogModel;
	}

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