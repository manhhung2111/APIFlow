import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DFolder} from "@db-schemas";


export default class Reader extends DBReader<DFolder>{
	constructor(obj: HydratedDocument<DFolder> | null | undefined){
		super(obj);
	}

	public async read(data: object){

	}


	public async readPrimary(){

	}
}
