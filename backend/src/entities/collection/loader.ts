import {Workspace} from "@entities/workspace";
import {DBCondition} from "@ap/db";
import {Collection} from "@entities/collection";

export default class Loader{

	public static async byWorkspace(workspace: Workspace){
		const workspace_id = workspace._object?._id.toString() || "";

		const condition = new DBCondition().setFilter({workspace_id: workspace_id})
			.setLimit(1);

		return await (new Collection).find(condition);
	}
}