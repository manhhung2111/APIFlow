import {DBListener} from "@ap/db";
import {HydratedDocument} from "mongoose";
import {DActivityLog} from "@db-schemas";

export default class Listener extends DBListener<DActivityLog>{

	constructor(obj: HydratedDocument<DActivityLog>){
		super(obj);
	}
}