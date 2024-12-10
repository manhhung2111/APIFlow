import {DBModel} from "@ap/db";
import RequestModel from "@models/request";
import {DRequest} from "@db-schemas";
import {DBRequestListener, DBRequestReader} from "@dev/request";
import {Model} from "mongoose";

export default class DBRequest extends DBModel<DRequest>{
	protected _db: Model<DRequest> = RequestModel;

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new DBRequestReader(this.object);
	}

	on(){
		return new DBRequestListener(this.object);
	}
}