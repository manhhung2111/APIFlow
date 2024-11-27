import DBModel from "../base/DBModel";
import UserModel from "../../models/user";
import Reader from "./reader";

class DBUser extends DBModel<typeof UserModel> {

    constructor() {
        super(UserModel);
    }

    release(): object {
        if(!this._object) return {};
        return this._object;
    }

    releaseCompact(): object {
        if(!this._object) return {};
        return this._object;
    }

    reader() {
        if(!this._object) return null;
        return new Reader(this._object, this);
    }
}

export default DBUser;