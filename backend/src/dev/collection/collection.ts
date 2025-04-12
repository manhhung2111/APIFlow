import {DBModel} from "@ap/db";
import CollectionModel from "@models/collection";
import {DCollection} from "@db-schemas";
import {DBCollectionExporter, DBCollectionListener, DBCollectionReader} from "@dev/collection";
import {Model} from "mongoose";

export default class DBCollection extends DBModel<DCollection> {
    protected _db: Model<DCollection> = CollectionModel;

    release(): object {
        return this.export(["_id", "workspace_id", "name", "content", "authorization", "scripts", "variables", "data", "token", "created_at", "updated_at"]);
    }

    releaseCompact(): object {
        return this.export(["_id", "name", "workspace_id", "created_at", "updated_at"]);
    }

    reader() {
        return new DBCollectionReader(this.object);
    }

    on() {
        return new DBCollectionListener(this.object);
    }

    exporter() {
        return new DBCollectionExporter(this.object);
    }
}