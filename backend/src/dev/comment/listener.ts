import {DBListener} from "@ap/db";
import {HydratedDocument} from "mongoose";
import {DComment} from "@db-schemas";

export default class Listener extends DBListener<DComment>{

	constructor(obj: HydratedDocument<DComment>){
		super(obj);
	}
}