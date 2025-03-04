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

		let new_folders: any = [];
		let new_requests: any = [];
		let new_examples: any = [];

		for (const folder of folders){
			const new_folder = await DBFolder.initialize() as DBFolder;

			await new_folder.reader().duplicate(folder);
			new_folder.object!.collection_id = this._obj!._id.toString();

			await new_folder.save(session);

			new_folders.push(new_folder);
			const [folder_requests, folder_examples] = await new_folder.on().duplicated(folder, session);
			new_requests = [...new_requests, ...folder_requests];
			new_examples = [...new_examples, ...folder_examples];
		}

		const requests = await DBRequestLoader.byCollectionWithoutFolder(this._obj!);
		for (const request of requests){
			const new_request = await DBRequest.initialize() as DBRequest;

			await new_request.reader().duplicate(request);
			new_request.object!.collection_id = this._obj!._id.toString();

			await new_request.save(session);

			new_requests.push(new_request);
			const examples = await new_request.on().duplicated(request, session);
			new_examples = [...new_examples, ...examples];
		}

		return [new_folders, new_requests, new_examples];
	}
}