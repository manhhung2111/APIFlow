import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DFolder} from "@db-schemas";
import {DBFolder} from "@dev/folder/index";


export default class Reader extends DBReader<DFolder>{
	constructor(obj: HydratedDocument<DFolder> | null | undefined){
		super(obj);
	}

	public async read(){

	}


	public async readPrimary(){

	}

	public async duplicate(old_folder: DBFolder){

	}

	public async readContent(){

	}

	public async readName(){

	}
}
