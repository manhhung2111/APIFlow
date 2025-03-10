import {DBCondition} from "@ap/db";
import {DBRequest} from "@dev/request";
import {HydratedDocument} from "mongoose";
import {DCollection, DFolder, DWorkspace} from "@db-schemas";

export default class Loader{

	static async byWorkspace(workspace: HydratedDocument<DWorkspace>){
		const workspace_id = workspace._id.toString();

		const sc = new DBCondition().setFilter({
			"workspace_id": workspace_id,
		}).setLimit(DBRequest.PAGE_SIZE);

		return await DBRequest.find(sc) as DBRequest[];
	}

	static async byFolder(folder: HydratedDocument<DFolder>){
		const folder_id = folder._id.toString();

		const sc = new DBCondition().setFilter({
			"folder_id": folder_id,
		}).setLimit(DBRequest.PAGE_SIZE);

		return await DBRequest.find(sc) as DBRequest[];
	}

	public static async byCollection(collection: HydratedDocument<DCollection>){
		const collection_id = collection._id.toString();

		const sc = new DBCondition().setFilter({
			"collection_id": collection_id,
		}).setLimit(DBRequest.PAGE_SIZE);

		return await DBRequest.find(sc) as DBRequest[];
	}

	public static async byCollectionWithoutFolder(collection: HydratedDocument<DCollection>){
		const collection_id = collection._id.toString();

		const sc = new DBCondition().setFilter({
			"collection_id": collection_id,
			"folder_id": null,
		}).setLimit(DBRequest.PAGE_SIZE);

		return await DBRequest.find(sc) as DBRequest[];
	}
}