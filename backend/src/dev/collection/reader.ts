import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DCollection} from "@db-schemas";


export default class Reader extends DBReader<DCollection>{
	constructor(obj: HydratedDocument<DCollection> | null | undefined){
		super(obj);
	}

	public async read(){

	}


	public async readPrimary(){

	}

	public async duplicate(){

	}

	public async readContent(){

	}

	public async readName(){

	}
}
