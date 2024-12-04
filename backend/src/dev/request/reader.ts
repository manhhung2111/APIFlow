import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DRequest} from "@db-schemas";
import {Request} from "@dev/request";

export default class Reader extends DBReader<DRequest>{
	constructor(obj: HydratedDocument<DRequest> | null | undefined){
		super(obj);
	}

	public async read(){

	}


	public async readPrimary(){

	}

	public async duplicate(old_request: Request){

	}
}
