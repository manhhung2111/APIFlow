import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DRequest} from "@db-schemas";
import {DBExample, DBExampleLoader} from "@dev/example";
import {DBRequest} from "@dev/request";

export default class Listener extends DBListener<DRequest>{

	constructor(obj: HydratedDocument<DRequest> | null | undefined){
		super(obj);
	}

	public async deleted(session: ClientSession | null = null){
		// TODO: Might consider bulk deleting in the future
		const examples = await DBExampleLoader.byRequest(this._obj!);

		for (const example of examples){
			await example.delete(session);
		}
	}

	public async duplicated(old_request: DBRequest, session: ClientSession | null = null){
		const old_examples = await DBExampleLoader.byRequest(old_request.object!);

		for (const old_example of old_examples){
			const new_example = await DBExample.initialize() as DBExample;

			await new_example.reader().duplicate(old_example);

			await new_example.save(session);
		}
	}
}