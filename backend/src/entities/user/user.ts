import DBModel from "../base/DBModel";
import UserModel from "../../models/user";
import Reader from "./reader";
import Code from "../../ap/code";

class DBUser extends DBModel {
    protected _db = UserModel;

    constructor() {
        super();
        this._db = UserModel;
    }

    release(): object {
        if (!this._object) return {};
        return this._object;
    }

    releaseCompact(): object {
        if (!this._object) return {};
        return this._object;
    }

    reader() {
        if (!this._object) {
            throw new Code('Invalid document');
        }
        return new Reader(this._object);
    }
}

export default DBUser;