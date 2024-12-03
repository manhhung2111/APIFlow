import {DBModel} from "@ap/db";
import ExampleModel from "@models/example";
import {DExample} from "@db-schemas";
import {ExampleReader} from "@entities/example";

export default class DBExample extends DBModel<DExample>{
	protected _db = ExampleModel;

	constructor(){
		super();
		this._db = ExampleModel;
	}

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new ExampleReader(this._object);
	}
}