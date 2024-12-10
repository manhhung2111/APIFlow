import {DBModel} from "@ap/db";
import CollectionModel from "@models/collection";
import {DCollection} from "@db-schemas";
import {DBCollectionListener, DBCollectionReader} from "@dev/collection";
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
		return new DBCollectionReader(this.object);
	}

	on(){
		return new DBCollectionListener(this.object);
	}
}