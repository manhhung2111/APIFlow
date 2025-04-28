import {DBCondition} from "@ap/db";
import {DBUser} from "@dev/user";
import {HTMLInput} from "@ap/core";

export default class Loader{

	public static async byEmail(email: string){
		const condition = new DBCondition().setFilter({email: email})
			.setLimit(1);

		return await DBUser.findOne(condition) as DBUser;
	}

	public static async searchByQuery() {
		const query = HTMLInput.query("query");
		const condition = new DBCondition().setFilter({
			email: { $regex: query, $options: "i" }, // Case-insensitive regex match
			is_verified: true,
		}).setLimit(DBUser.PAGE_SIZE);

		return await DBUser.find(condition) as DBUser[];
	}

	public static async all() {
		const condition = new DBCondition().setFilter({})
			.setLimit(DBUser.PAGE_SIZE);
		return await DBUser.find(condition) as DBUser[];
	}

	public static async byVerifiedToken(token: string) {
		const condition = new DBCondition().setFilter({is_verified: false, verification_token: token})
			.setLimit(1);
		return await DBUser.findOne(condition) as DBUser;
	}
}