import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DComment} from "@db-schemas";


export default class Reader extends DBReader<DComment>{
	constructor(obj: HydratedDocument<DComment> | null | undefined){
		super(obj);
	}

	public async read(data: object){

	}


	public async readPrimary(){

	}
}
