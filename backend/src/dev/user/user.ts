import {DBModel} from "@ap/db";
import UserModel from "@models/user";
import {DUser} from "@db-schemas";
import {DBUserReader} from "@dev/user";
import {Model} from "mongoose";

export default class DBUser extends DBModel<DUser>{
	protected _db: Model<DUser> = UserModel;

	release(): object{
		return this.export(["_id", "email", "username", "name", "data", "created_at", "updated_at"]);
	}

	releaseCompact(): object{
		return this.export(["_id", "email", "name", "username"]);
	}

	reader(){
		return new DBUserReader(this.object);
	}
}