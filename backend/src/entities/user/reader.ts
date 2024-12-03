import bcrypt from "bcrypt";
import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {Code, Validation} from "@ap/core";
import {UserLoader} from "@entities/user";
import {DUser} from "@db-schemas";

export default class Reader extends DBReader<DUser>{
	constructor(obj: HydratedDocument<DUser> | null | undefined){
		super(obj);
	}

	public async read(data: any){
		let {email, password, first_name, last_name} = data;

		if (!Validation.validEmail(email)){
			throw new Code("Invalid email address.");
		}

		if (await UserLoader.byEmail(email)){
			throw new Code("This email is taken by another account");
		}

		this._obj.email = email;
		this._obj.password = await this.hashPassword(password);
		this._obj.first_name = first_name;
		this._obj.last_name = last_name;
	}


	public async readPrimary(){

	}

	public async readPassword(){

	}


	private async hashPassword(password: string){
		let salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	}
}
