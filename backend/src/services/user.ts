import {Code, HTMLInput, Validation} from "@ap/core";
import {DBUserLoader} from "@dev/user";
import bcrypt from "bcrypt";
import {OAuth2Client} from "google-auth-library";
import * as process from "node:process";
import axios from "axios";

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

	public static async loginGoogle() {
		try {
			const token = HTMLInput.inputNoSafe("token");

			const { data: userData } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: { Authorization: `Bearer ${token}` }
			});

			return {
				email: userData.email,
				name: userData.name,
				sub: userData.sub,
			}
		} catch (error) {
			throw new Error((error as Error).message);
		}
	}
}