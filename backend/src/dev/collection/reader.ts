import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DCollection} from "@db-schemas";


export default class Reader extends DBReader<DCollection>{
	constructor(obj: HydratedDocument<DCollection> | null | undefined){
		super(obj);
	}

	public async read(data: object){

	}


	public async readPrimary(){

	}
}
