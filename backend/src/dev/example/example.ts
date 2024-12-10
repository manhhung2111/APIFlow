import {DBModel} from "@ap/db";
import ExampleModel from "@models/example";
import {DExample} from "@db-schemas";
import {ExampleReader} from "@dev/example";
import {Model} from "mongoose";

export default class DBExample extends DBModel<DExample>{
	protected _db: Model<DExample> = ExampleModel;

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new ExampleReader(this.object);
	}
}