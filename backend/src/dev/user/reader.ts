import bcrypt from "bcrypt";
import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {Code, HTMLInput, Validation} from "@ap/core";
import {DBUserLoader} from "@dev/user";
import {DUser} from "@db-schemas";
import TokenGenerator from "@utils/token.generator";
import {sha256} from "js-sha256";

export default class Reader extends DBReader<DUser>{
	constructor(obj: HydratedDocument<DUser> | null | undefined){
		super(obj);
	}

	public async read() {
		let email = HTMLInput.inputInline("email");
		let password = HTMLInput.inputInline("password");
		let name = HTMLInput.inputInline("name");

		if (!Validation.validEmail(email)) {
			throw new Code("Invalid email address.");
		}

		const user = await DBUserLoader.byEmail(email);
		if (user.good()) {
			throw new Code("This email is taken by another account.");
		}

		if (Validation.isEmpty(password)) {
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


	public async hashPassword(password: string){
		let salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	}
}
