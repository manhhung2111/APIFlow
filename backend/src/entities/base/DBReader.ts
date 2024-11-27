import {Document} from "mongoose";

abstract class DBReader {
    protected _obj: Document;

    protected constructor(obj: Document) {
        this._obj = obj;
    }

    protected isCreating(): boolean {
        return this._obj?._id == null;
    }

    protected isEditing(): boolean {
        return this._obj?._id != null;
    };
}

export default DBReader;