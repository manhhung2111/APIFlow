import DbCondition from "@ap/db/db.condition";
import {DBExample} from "@dev/example";
import {HydratedDocument} from "mongoose";
import {DRequest} from "@db-schemas";

export default class Loader{

	public static async byRequest(request: HydratedDocument<DRequest>){
		const request_id = request._id.toString();
		const workspace_id = request.workspace_id.toString();

		const sc = new DbCondition().setFilter({"request_id": request_id, "workspace_id": workspace_id});
		return await DBExample.find(sc) as DBExample[];
	}
}