import {HydratedDocument} from "mongoose";
import {Code} from "@ap/core";

abstract class DBListener<T>{
	protected _obj: HydratedDocument<T> | null | undefined;

	protected constructor(obj: HydratedDocument<T> | null | undefined){
		if (!obj){
			throw new Code("Please initialize document before using Listener class.");
		}
		this._obj = obj;
	}
}

export default DBListener;