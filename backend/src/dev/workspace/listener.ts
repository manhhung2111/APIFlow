import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DWorkspace} from "@db-schemas";
import {DBCollection, DBCollectionLoader} from "@dev/collection";
import {DBEnvironment, DBEnvironmentLoader} from "@dev/environment";
import {DBFolder, DBFolderLoader} from "@dev/folder";
import {DBRequest, DBRequestLoader} from "@dev/request";
import DbCondition from "@ap/db/db.condition";
import {DBExample} from "@dev/example";

export default class Listener extends DBListener<DWorkspace>{

	constructor(obj: HydratedDocument<DWorkspace> | null | undefined){
		super(obj);
	}


	public async created(session: ClientSession | null = null){
		// Create a global environment
		const environment = await DBEnvironment.initialize() as DBEnvironment;

		await environment.reader().readGlobal(this._obj!._id.toString());

		await environment.save(session);
	}

	public async deleted(session: ClientSession | null = null){
		const workspace_id = this._obj!._id.toString();

		const condition = new DbCondition().setFilter({"workspace_id": workspace_id});

		await DBCollection.deleteMany(condition, session);
		await DBFolder.deleteMany(condition, session);
		await DBRequest.deleteMany(condition, session);
		await DBExample.deleteMany(condition, session);

		/**
		 The old way to delete 1 by 1

			for (const collection of collections){
				await collection.delete(session);

				await collection.on().deleted(session);
			}

			const environments = await DBEnvironmentLoader.byWorkspace(this._obj!);
			for (const environment of environments){
				await environment.delete(session);
			}

		 */
	}
}