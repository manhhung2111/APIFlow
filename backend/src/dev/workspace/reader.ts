import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DWorkspace} from "@db-schemas";

export default class Reader extends DBReader<DWorkspace>{
	constructor(obj: HydratedDocument<DWorkspace> | null | undefined){
		super(obj);
	}

	public async read(){

	}

	public async readPrimary(){

	}

	public async readName(){

	}

	public async readContent(){

	}
}
