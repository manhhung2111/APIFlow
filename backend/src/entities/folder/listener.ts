import {DBListener} from "@ap/db";
import {HydratedDocument} from "mongoose";
import {DFolder} from "@db-schemas";

export default class Listener extends DBListener<DFolder>{

	constructor(obj: HydratedDocument<DFolder>){
		super(obj);
	}
}