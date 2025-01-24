import {DBModel} from "@ap/db";
import EnvironmentModel from "@models/environment";
import {DEnvironment} from "@db-schemas";
import {DBEnvironmentReader} from "@dev/environment";
import {Model} from "mongoose";

export default class DBEnvironment extends DBModel<DEnvironment>{
	protected _db: Model<DEnvironment> = EnvironmentModel;

	release(): object{
		return this.export(["user_id", "workspace_id", "name", "scope", "variables", "data", "token", "created_at", "updated_at"]);
	}

	releaseCompact(): object{
		return this.export(["user_id", "workspace_id", "name", "scope"]);
	}

	reader(){
		return new DBEnvironmentReader(this.object);
	}
}