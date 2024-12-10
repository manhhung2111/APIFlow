import {DBModel} from "@ap/db";
import UserModel from "@models/user";
import {DUser} from "@db-schemas";
import {UserReader} from "@dev/user";
import {Model} from "mongoose";

export default class DBUser extends DBModel<DUser>{
	protected _db: Model<DUser> = UserModel;

	release(): object{
		return this.export(["email", "first_name", "last_name", "data", "created_at", "updated_at"]);
	}

	releaseCompact(): object{
		return this.export(["email", "first_name", "last_name"]);
	}

	reader(){
		return new UserReader(this.object);
	}
}