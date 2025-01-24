import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DRequest} from "@db-schemas";
import {DBRequest} from "@dev/request";

export default class Listener extends DBListener<DRequest>{

	constructor(obj: HydratedDocument<DRequest> | null | undefined){
		super(obj);
	}

	public async deleted(session: ClientSession | null = null){
		// TODO: Might consider bulk deleting in the future

	}

	public async duplicated(old_request: DBRequest, session: ClientSession | null = null){

	}
}