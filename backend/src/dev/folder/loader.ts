import {HydratedDocument} from "mongoose";
import {DCollection, DWorkspace} from "@db-schemas";
import {DBCondition} from "@ap/db";
import {DBFolder} from "@dev/folder";

export default class Loader{

	public static async byWorkspace(workspace: HydratedDocument<DWorkspace>){
		const workspace_id = workspace._id.toString();

		const sc = new DBCondition().setFilter({
			"workspace_id": workspace_id,
		}).setLimit(DBFolder.PAGE_SIZE);

		return await DBFolder.find(sc) as DBFolder[];
	}

	public static async byCollection(collection: HydratedDocument<DCollection>){
		const collection_id = collection._id.toString();

		const sc = new DBCondition().setFilter({
			"collection_id": collection_id,
		}).setLimit(DBFolder.PAGE_SIZE);

		return await DBFolder.find(sc) as DBFolder[];
	}
}