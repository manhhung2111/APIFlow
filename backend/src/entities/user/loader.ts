import {DBCondition} from "@ap/db";
import {User} from "@entities/user";

export default class Loader{

	public static async byEmail(email: string){
		const condition = new DBCondition().setFilter({email: email})
			.setLimit(1);

		const user = new User();

		return await user.findOne(condition);
	}
}