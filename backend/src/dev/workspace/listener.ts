import {DBListener} from "@ap/db";
import {HydratedDocument} from "mongoose";
import {DWorkspace} from "@db-schemas";

export default class Listener extends DBListener<DWorkspace>{

	constructor(obj: HydratedDocument<DWorkspace>){
		super(obj);
	}
}