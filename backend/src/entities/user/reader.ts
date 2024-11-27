import DBReader from "../base/DBReader";
import {Document, Model} from "mongoose";
import User from '../../models/user';

class Reader extends DBReader {
    protected obj: Document<any>;

    constructor(obj: Document) {
        super(obj);
        this.obj = obj;
    }

    read(){
        this.obj.set("email", "manhhung2720");
    }
}

export default Reader;