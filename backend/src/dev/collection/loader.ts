import {DBWorkspace} from "@dev/workspace";
import {DBCondition} from "@ap/db";
import {Collection} from "@dev/collection";

export default class Loader{

	public static async byWorkspace(workspace: DBWorkspace){
		const workspace_id = workspace._object?._id.toString() || "";

		const condition = new DBCondition().setFilter({workspace_id: workspace_id})
			.setLimit(1);

		return await Collection.find(condition) as Collection[];
	}
}