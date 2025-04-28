import {DBUser} from "@dev/user";
import {HydratedDocument} from "mongoose";
import {DUser} from "@db-schemas";

export default class Client{

	public static authenticated: boolean = false;
	public static viewer: HydratedDocument<DUser>;

	public static async authenticate(user_id: string){
		if (!user_id) return false;

		const user = await DBUser.initialize(user_id);
		if (!user.good()) return false;

		this.authenticated = true;
		this.viewer = user.object!;

		return user;
	}
}