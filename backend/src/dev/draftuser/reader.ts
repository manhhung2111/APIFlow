import bcrypt from "bcrypt";
import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {Code, HTMLInput, Validation} from "@ap/core";
import {DBUserLoader} from "@dev/user";
import {DDraftUser, DUser} from "@db-schemas";
import TokenGenerator from "@utils/token.generator";
import {sha256} from "js-sha256";

export default class Reader extends DBReader<DDraftUser>{
	constructor(obj: HydratedDocument<DDraftUser> | null | undefined){
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
        
        this._obj.verification_token = TokenGenerator.generateOTP();
        this._obj.verification_token_expiry = Math.floor(Date.now() / 1000) + 5 * 60;
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
