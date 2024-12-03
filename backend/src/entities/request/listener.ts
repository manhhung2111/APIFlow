import {DBListener} from "@ap/db";
import {HydratedDocument} from "mongoose";
import {DRequest} from "@db-schemas";

export default class Listener extends DBListener<DRequest>{

	constructor(obj: HydratedDocument<DRequest>){
		super(obj);
	}
}