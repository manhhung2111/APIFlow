import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DCollection} from "@db-schemas";
import {DBFolder, DBFolderLoader} from "@dev/folder";
import {DBRequest, DBRequestLoader} from "@dev/request";
import {DBCollection} from "@dev/collection";

export default class Listener extends DBListener<DCollection>{

	constructor(obj: HydratedDocument<DCollection> | null | undefined){
		super(obj);
	}

	public async deleted(session: ClientSession | null = null){
		const folders = await DBFolderLoader.byCollection(this._obj!);
		for (const folder of folders){
			await folder.delete(session);

			await folder.on().deleted(session);
		}

		const requests = await DBRequestLoader.byCollectionWithoutFolder(this._obj!);
		for (const request of requests){
			await request.delete(session);

			await request.on().deleted(session);
		}
	}

	public async duplicated(old_collection: DBCollection, session: ClientSession){
		const folders = await DBFolderLoader.byCollection(old_collection.object!);
		for (const folder of folders){
			const new_folder = await DBFolder.initialize() as DBFolder;

			await new_folder.reader().duplicate(folder);

			await new_folder.save(session);

			await new_folder.on().duplicated(folder, session);
		}

		const requests = await DBRequestLoader.byCollectionWithoutFolder(this._obj!);
		for (const request of requests){
			const new_request = await DBRequest.initialize() as DBRequest;

			await new_request.reader().duplicate(request);

			await new_request.save(session);

			await new_request.on().duplicated(request, session);
		}
	}
}