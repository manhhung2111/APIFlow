import {HydratedDocument} from "mongoose";
import {DWorkspace} from "@db-schemas";
import {DBCondition} from "@ap/db";
import {DBEnvironment} from "@dev/environment";

export default class Loader{

	public static async byWorkspace(workspace: HydratedDocument<DWorkspace>){
		const workspace_id = workspace._id.toString();

		const condition = new DBCondition().setFilter({"workspace_id": workspace_id})
			.setLimit(DBEnvironment.PAGE_SIZE);

		return await DBEnvironment.find(condition) as DBEnvironment[];
	}
}