import {DBModel} from "@ap/db";
import UserModel from "@models/user";
import {DUser} from "@db-schemas";
import {UserReader} from "@entities/user";

export default class DBUser extends DBModel<DUser>{
	protected _db = UserModel;

	constructor(){
		super();
		this._db = UserModel;
	}

	release(): object{
		return this.export(["email", "first_name", "last_name", "data", "created_at", "updated_at"]);
	}

	releaseCompact(): object{
		return this.export(["email", "first_name", "last_name"]);
	}

	reader(){
		return new UserReader(this._object);
	}
}