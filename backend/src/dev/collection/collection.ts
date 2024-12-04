import {DBModel} from "@ap/db";
import CollectionModel from "@models/collection";
import {DCollection} from "@db-schemas";
import {CollectionReader} from "@dev/collection";
import {Model} from "mongoose";

export default class DBCollection extends DBModel<DCollection>{
	protected _db: Model<DCollection> = CollectionModel;

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new CollectionReader(this._object);
	}
}