import DBListener from "../base/DBListener";
import {Document, HydratedDocument} from "mongoose";
import {IUser} from "../../../database";

export default class Listener extends DBListener<IUser> {

    constructor(obj: HydratedDocument<IUser>) {
        super(obj);
    }
}