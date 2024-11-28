import DBModel from "../base/DBModel";
import UserModel from "../../models/user";
import Reader from "./reader";
import Code from "../../ap/code";

class DBUser extends DBModel<typeof UserModel> {

    constructor(_id: string = "") {
        super(UserModel, _id);
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
        if(!this._object){
            throw new Code("Invalid data");
        }
        return new Reader(this._object, this);
    }
}

export default DBUser;