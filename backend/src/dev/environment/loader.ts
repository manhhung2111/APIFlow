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

	public static async globalsEnvByWorkspace(workspace: HydratedDocument<DWorkspace> | string) {
		let workspace_id: string;

		// Ensure workspace is a HydratedDocument before accessing _id
		if (typeof workspace !== "string") {
			workspace_id = workspace._id.toString();
		} else {
			workspace_id = workspace;
		}

		const condition = new DBCondition().setFilter({ workspace_id: workspace_id, scope: 0 });

		return await DBEnvironment.findOne(condition) as DBEnvironment;
	}

}