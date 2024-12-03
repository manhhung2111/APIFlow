import {HydratedDocument} from "mongoose";
import {Code} from "@ap/core";

abstract class DBReader<T>{
	protected _obj: HydratedDocument<T>;

	protected constructor(obj: HydratedDocument<T> | null | undefined){
		if (!obj){
			throw new Code("Please initialize document before using Reader class.");
		}
		this._obj = obj;
	}

	protected isCreating(): boolean{
		return this._obj?.isNew;
	}

	protected isEditing(): boolean{
		return !this._obj?.isNew;
	}
}

export default DBReader;
