import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DRequest} from "@db-schemas";
import {DBRequest, DBRequestLoader} from "@dev/request";
import {DBExample, DBExampleLoader} from "@dev/example";
import DbCondition from "@ap/db/db.condition";

export default class Listener extends DBListener<DRequest>{

	constructor(obj: HydratedDocument<DRequest> | null | undefined){
		super(obj);
	}

	public async deleted(session: ClientSession | null = null){
		// TODO: Might consider bulk deleting in the future
		const examples = await DBExampleLoader.byRequest(this._obj!);
		const sc = new DbCondition().setFilter({"request_id": this._obj!._id.toString(), "workspace_id": this._obj!.workspace_id.toString()});

		await DBExample.deleteMany(sc, session);
	}

	public async duplicated(old_request: DBRequest, session: ClientSession | null = null){
		const old_examples = await DBExampleLoader.byRequest(old_request.object!);

		let new_examples: any = [];
		for (const old_example of old_examples){
			const new_example = await DBExample.initialize() as DBExample;

			await new_example.reader().duplicate(old_example);
			new_example.object!.collection_id = this._obj!.collection_id;
			new_example.object!.folder_id = this._obj!.folder_id?.toString() ?? null;
			new_example.object!.request_id = this._obj!._id.toString();

			await new_example.save(session);

			new_examples.push(new_example);
		}

		return new_examples;
	}
}