import {DBModel} from "@ap/db";
import EnvironmentModel from "@models/environment";
import {DEnvironment} from "@db-schemas";
import {EnvironmentReader} from "@entities/environment";

export default class DBEnvironment extends DBModel<DEnvironment>{
	protected _db = EnvironmentModel;

	constructor(){
		super();
		this._db = EnvironmentModel;
	}

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new EnvironmentReader(this._object);
	}
}