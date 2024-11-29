import DBModel from "../base/DBModel";
import UserModel from "../../models/user";
import Reader from "./reader";
import Code from "../../ap/code";
import {IUser} from "../../../database";

class DBUser extends DBModel<IUser> {
    protected _db = UserModel;

    constructor() {
        super();
        this._db = UserModel;
    }

    release(): object {
        if (!this.good()) return {};
        return {
            "email": this._object?.email,
            "first_name": this._object?.first_name,
            "last_name": this._object?.last_name,
        }
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