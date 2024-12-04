import {DBWorkspace} from "@dev/workspace";
import Client from "@dev/client";
import {DBCondition} from "@ap/db";
import {Request} from "@dev/request";

export default class Loader{

	static async byWorkspace(workspace: DBWorkspace){
		const workspace_id = workspace.getField("_id");
		const user_id = Client.viewer._id.toString();

		const sc = new DBCondition().setFilter({
			user_id: user_id,
			workspace_id: workspace_id,
		}).setLimit(Request.PAGE_SIZE);

		return await Request.find(sc) as Request[];
	}
}