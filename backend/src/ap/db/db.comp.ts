import {HydratedDocument} from "mongoose";
import {Code} from "@ap/core";

export default class DBComp<T>{
	protected _obj: HydratedDocument<T> | null | undefined;

	protected constructor(obj: HydratedDocument<T> | null | undefined){
		if (!obj){
			throw new Code("Please initialize document before using DBComp class.");
		}
		this._obj = obj;
	}
}