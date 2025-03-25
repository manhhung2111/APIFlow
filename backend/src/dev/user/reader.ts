import bcrypt from "bcrypt";
import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {Code, HTMLInput, Validation} from "@ap/core";
import {DBUserLoader} from "@dev/user";
import {DUser} from "@db-schemas";

export default class Reader extends DBReader<DUser>{
	constructor(obj: HydratedDocument<DUser> | null | undefined){
		super(obj);
	}

	public async read(){
		let email = HTMLInput.inputInline("email");
		let username = HTMLInput.inputInline("username");
		let password = HTMLInput.inputInline("password");
		let name = HTMLInput.inputInline("name");

		if (!Validation.validEmail(email)){
			throw new Code("Invalid email address.");
		}

		const user = await DBUserLoader.byEmailOrUsername(email, username);
		if (user.good()){
			throw new Code("This email or username is taken by another account.");
		}

		if (Validation.isEmpty(password)){
			throw new Code("Password must not be empty.");
		}

		this._obj.email = email;
		this._obj.password = await this.hashPassword(password);
		this._obj.name = name;
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
