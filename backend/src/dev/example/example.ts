import {DBModel} from "@ap/db";
import ExampleModel from "@models/example";
import {DExample} from "@db-schemas";
import {DBExampleReader} from "@dev/example";
import {Model} from "mongoose";

export default class DBExample extends DBModel<DExample>{
    protected _db: Model<DExample> = ExampleModel;

    release(): object{
        return this.export(["_id", "user_id", "workspace_id", "collection_id", "folder_id", "request_id", "name", "request", "response", "data", "token", "created_at", "updated_at"]);
    }

    releaseCompact(): object{
        return this.export(["_id", "user_id", "workspace_id", "collection_id", "folder_id", "request_id", "name"]);
    }

    reader(){
        return new DBExampleReader(this.object);
    }
}