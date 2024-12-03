import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DActivityLog} from "@db-schemas";


export default class Reader extends DBReader<DActivityLog>{
	constructor(obj: HydratedDocument<DActivityLog> | null | undefined){
		super(obj);
	}

	public async read(data: object){

	}


	public async readPrimary(){

	}
}
