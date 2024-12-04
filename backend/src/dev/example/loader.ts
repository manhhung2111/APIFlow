import {Request} from "@dev/request";
import DbCondition from "@ap/db/db.condition";
import {Example} from "@dev/example";

export default class Loader{

	public static async byRequest(old_request: Request){
		const request_id = old_request.getField("_id");
		const workspace_id = old_request.getField("workspace_id");

		const sc = new DbCondition().setFilter({request_id: request_id, workspace_id: workspace_id});
		return await Example.find(sc) as Example[];
	}
}