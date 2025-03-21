import {HydratedDocument} from "mongoose";
import {DWorkspace} from "@db-schemas";
import {DBCondition} from "@ap/db";
import {DBPersona} from "@dev/persona/index";

export default class Loader {

    public static async byWorkspace(workspace: HydratedDocument<DWorkspace>) {
        const workspace_id = workspace._id.toString();

        const condition = new DBCondition().setFilter({"workspace_id": workspace_id})
            .setLimit(DBPersona.PAGE_SIZE);

        return await DBPersona.find(condition) as DBPersona[];
    }
}