import {HydratedDocument} from "mongoose";
import {Code} from "@ap/core";

export default class DBUserAcl<T>{
	protected _obj: HydratedDocument<T> | null | undefined;
	protected _user_id: string;

	constructor(obj: HydratedDocument<T> | null | undefined, user_id: string){
		if (!obj){
			throw new Code("Please initialize document before using DBUserAcl class.");
		}
		this._obj = obj;
		this._user_id = user_id;
		this.__init();
	}

	protected __init(){

	}
}