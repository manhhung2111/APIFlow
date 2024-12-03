import {DBCondition} from "@ap/db";

export default class Loader{

	public static workspaces(user_id: string = "", workspace_id: string = "", limit: number, offset: number){
		const sc = new DBCondition().setFilter({
			user_id: { $eq: user_id },
			workspace_id: {$eq: workspace_id}
		}).setLimit(limit).setSkip(offset);


	}
}