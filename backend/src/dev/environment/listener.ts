import {DBListener} from "@ap/db";
import {HydratedDocument} from "mongoose";
import {DEnvironment} from "@db-schemas";

export default class Listener extends DBListener<DEnvironment>{

	constructor(obj: HydratedDocument<DEnvironment>){
		super(obj);
	}
}