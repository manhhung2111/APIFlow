import {HydratedDocument} from "mongoose";

abstract class DBReader<T> {
  protected _obj: HydratedDocument<T>;

  protected constructor(obj: HydratedDocument<T>) {
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
