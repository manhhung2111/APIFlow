import {DBListener} from "@ap/db";
import {HydratedDocument} from "mongoose";
import {DUser} from "@db-schemas";

export default class Listener extends DBListener<DUser> {

    constructor(obj: HydratedDocument<DUser>) {
        super(obj);
    }
}