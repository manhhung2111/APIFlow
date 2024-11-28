import { Document } from "mongoose";
import DBModel from "./DBModel";

abstract class DBReader {
  protected _obj: Document;
  protected _db_model: DBModel<any>;

  protected constructor(obj: Document, db: DBModel<any>) {
    this._obj = obj;
    this._db_model = db;
  }

  protected isCreating(): boolean {
    return this._obj?.isNew;
  }

  protected isEditing(): boolean {
    return !this._obj?.isNew;
  }
}

export default DBReader;
