import {Document} from "mongoose";

abstract class DBListener {
    protected _obj: Document;

    protected constructor(obj: Document) {
        this._obj = obj;
    }
}

export default DBListener;