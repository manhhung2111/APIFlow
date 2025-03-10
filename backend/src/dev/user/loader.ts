import {DBCondition} from "@ap/db";
import {DBUser} from "@dev/user";
import {HTMLInput} from "@ap/core";

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


	public static async searchByQuery() {
		const query = HTMLInput.query("query");
		const condition = new DBCondition().setFilter({
			username: { $regex: query, $options: "i" } // Case-insensitive regex match
		}).setLimit(DBUser.PAGE_SIZE);

		return await DBUser.find(condition) as DBUser[];
	}

	public static async byUsernames(usernames: string[]) {
		const sc = new DBCondition().setFilter({
			username: { $in: usernames }
		});

		return await DBUser.find(sc) as DBUser[];
	}


	public static async all() {
		return await DBUser.find() as DBUser[];
	}
}