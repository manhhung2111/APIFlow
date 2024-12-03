import {DBListener} from "@ap/db";
import {HydratedDocument} from "mongoose";
import {DCollection} from "@db-schemas";

export default class Listener extends DBListener<DCollection>{

	constructor(obj: HydratedDocument<DCollection>){
		super(obj);
	}
}