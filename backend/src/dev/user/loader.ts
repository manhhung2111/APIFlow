import {DBCondition} from "@ap/db";
import {User} from "@dev/user";

export default class Loader{

	public static async byEmail(email: string){
		const condition = new DBCondition().setFilter({email: email})
			.setLimit(1);

		return await User.findOne(condition) as User;
	}
}