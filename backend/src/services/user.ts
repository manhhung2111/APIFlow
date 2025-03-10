import {Code, HTMLInput, Validation} from "@ap/core";
import {DBUserLoader} from "@dev/user";
import bcrypt from "bcrypt";

export default class UserService{

	public static async login(){
		const email = HTMLInput.inputInline("email");
		const password = HTMLInput.inputInline("password");

		if (!Validation.validEmail(email)){
			throw new Code("Invalid email address.");
		}

		let user = await DBUserLoader.byEmail(email);
		if (!user.good()){
			throw new Code("Invalid Email or Password!");
		}

		let correct_password = await bcrypt.compare(password, user.getField("password"));
		if (!correct_password){
			throw new Code("Invalid Email or Password!");
		}

		return user;
	}
}