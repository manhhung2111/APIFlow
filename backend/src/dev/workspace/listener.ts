import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DWorkspace} from "@db-schemas";
import {DBCollectionLoader} from "@dev/collection";
import {DBEnvironmentLoader} from "@dev/environment";

export default class Listener extends DBListener<DWorkspace>{

	constructor(obj: HydratedDocument<DWorkspace> | null | undefined){
		super(obj);
	}


	public async created(session: ClientSession | null = null){



	}

	public async deleted(session: ClientSession | null = null){
		const collections = await DBCollectionLoader.byWorkspace(this._obj!);
		for (const collection of collections){
			await collection.delete(session);

			await collection.on().deleted(session);
		}

		const environments = await DBEnvironmentLoader.byWorkspace(this._obj!);
		for (const environment of environments){
			await environment.delete(session);
		}
	}
}