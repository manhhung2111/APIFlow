import {DBModel} from "@ap/db";
import UserModel from "@models/user";
import {Code} from "@ap/core";
import {DUser} from "@db-schemas";
import {UserReader} from "@entities/user";

class DBUser extends DBModel<DUser> {
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
        return new UserReader(this._object);
    }
}

export default DBUser;