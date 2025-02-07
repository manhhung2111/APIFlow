import {DBCondition} from "@ap/db";
import {DBUser} from "@dev/user";

export default class Loader{

	public static async byEmail(email: string){
		const condition = new DBCondition().setFilter({email: email})
			.setLimit(1);

		return await DBUser.findOne(condition) as DBUser;
	}


	public static async byEmailOrUsername(email: string, username: string){
		const condition = new DBCondition().setFilter(({
			$or: [
				{ email: email },
				{ username: username }
			]
		}))
			.setLimit(1);

		return await DBUser.findOne(condition) as DBUser;
	}
}