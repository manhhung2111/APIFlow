import DbCondition from "@ap/db/db.condition";
import {DBExample} from "@dev/example";
import {HydratedDocument} from "mongoose";
import {DRequest, DWorkspace} from "@db-schemas";
import {DBCondition} from "@ap/db";
import {DBRequest} from "@dev/request";

export default class Loader{

    public static async byRequest(request: HydratedDocument<DRequest>){
        const request_id = request._id.toString();
        const workspace_id = request.workspace_id.toString();

        const sc = new DbCondition().setFilter({"request_id": request_id, "workspace_id": workspace_id});
        return await DBExample.find(sc) as DBExample[];
    }


    public static async byWorkspace(workspace: HydratedDocument<DWorkspace>){
        const workspace_id = workspace._id.toString();

        const sc = new DBCondition().setFilter({
            "workspace_id": workspace_id,
        }).setLimit(DBRequest.PAGE_SIZE);

        return await DBExample.find(sc) as DBExample[];
    }
}