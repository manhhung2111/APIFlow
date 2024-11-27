import DBModel from "../base/DBModel";
import User from "../../models/user";
import {Model, Document} from "mongoose";
import Reader from "./reader";



class DBUser extends DBModel<typeof User> {

    constructor() {
        super(User);
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
        return new Reader(this._object);
    }
}

export default DBUser;