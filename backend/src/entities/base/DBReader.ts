import { Document } from "mongoose";
import DBModel from "./DBModel";
import Code from "../../ap/code";

abstract class DBReader {
  protected _obj: Document;

  protected constructor(obj: Document) {
    this._obj = obj;
  }

  protected isCreating(): boolean {
    return this._obj?.isNew;
  }

  protected isEditing(): boolean {
    return !this._obj?.isNew;
  }
}

export default DBReader;
