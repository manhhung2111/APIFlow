import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DExample} from "@db-schemas";
import {Example} from "@dev/example";

export default class Reader extends DBReader<DExample>{
	constructor(obj: HydratedDocument<DExample> | null | undefined){
		super(obj);
	}

	public async read(){

	}


	public async readPrimary(){

	}

	async duplicate(old_example: Example){

	}
}
