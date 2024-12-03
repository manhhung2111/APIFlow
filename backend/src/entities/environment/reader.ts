import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DEnvironment} from "@db-schemas";


export default class Reader extends DBReader<DEnvironment>{
	constructor(obj: HydratedDocument<DEnvironment> | null | undefined){
		super(obj);
	}

	public async read(data: object){

	}


	public async readPrimary(){

	}
}
