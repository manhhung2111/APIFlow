import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DRequest} from "@db-schemas";
import {DBRequest} from "@dev/request";
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

	}
}