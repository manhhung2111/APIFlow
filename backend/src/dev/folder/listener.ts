import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DFolder} from "@db-schemas";
import {DBRequest, DBRequestLoader} from "@dev/request";
import {DBFolder} from "@dev/folder";

export default class Listener extends DBListener<DFolder>{

	constructor(obj: HydratedDocument<DFolder> | null | undefined){
		super(obj);
	}

	public async deleted(session: ClientSession | null){
		const requests = await DBRequestLoader.byFolder(this._obj!);

		for (let request of requests){
			await request.delete(session);

			await request.on().deleted(session);
		}
	}

	async duplicated(old_folder: DBFolder, session: ClientSession | null){
		const old_requests = await DBRequestLoader.byFolder(old_folder.object!);

		for (const old_request of old_requests){
			const new_request = await DBRequest.initialize() as DBRequest;

			await new_request.reader().duplicate(old_request);

			await new_request.save(session);

			await new_request.on().duplicated(old_request, session);
		}
	}
}