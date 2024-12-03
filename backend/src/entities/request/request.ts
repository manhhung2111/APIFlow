import {DBModel} from "@ap/db";
import RequestModel from "@models/request";
import {DRequest} from "@db-schemas";
import {RequestReader} from "@entities/request";

export default class DBRequest extends DBModel<DRequest>{
	protected _db = RequestModel;

	constructor(){
		super();
		this._db = RequestModel;
	}

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new RequestReader(this._object);
	}
}