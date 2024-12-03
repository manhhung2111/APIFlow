import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DRequest} from "@db-schemas";


export default class Reader extends DBReader<DRequest>{
	constructor(obj: HydratedDocument<DRequest> | null | undefined){
		super(obj);
	}

	public async read(data: object){

	}


	public async readPrimary(){

	}
}
