import {HydratedDocument} from "mongoose";

abstract class DBListener<T> {
    protected _obj: HydratedDocument<T>;

    protected constructor(obj: HydratedDocument<T>) {
        this._obj = obj;
    }
}

export default DBListener;