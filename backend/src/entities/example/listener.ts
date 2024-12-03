import {DBListener} from "@ap/db";
import {HydratedDocument} from "mongoose";
import {DExample} from "@db-schemas";

export default class Listener extends DBListener<DExample>{

	constructor(obj: HydratedDocument<DExample>){
		super(obj);
	}
}