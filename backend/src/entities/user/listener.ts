import DBListener from "../base/DBListener";
import {Document} from "mongoose";

export default class Listener extends DBListener {

    constructor(obj: Document) {
        super(obj);
    }
}