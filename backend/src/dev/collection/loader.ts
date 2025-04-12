import {DBCondition} from "@ap/db";
import {DBCollection} from "@dev/collection";
import {HydratedDocument} from "mongoose";
import {DWorkspace} from "@db-schemas";

export default class Loader{

	public static async byWorkspace(workspace: HydratedDocument<DWorkspace>){
		const workspace_id = workspace._id.toString();

		const condition = new DBCondition().setFilter({"workspace_id": workspace_id})
			.setLimit(DBCollection.PAGE_SIZE);

		return await DBCollection.find(condition) as DBCollection[];
	}
}