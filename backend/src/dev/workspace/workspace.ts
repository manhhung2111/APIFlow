import {DBModel} from "@ap/db";
import WorkspaceModel from "@models/workspace";
import {DWorkspace} from "@db-schemas";
import {DBWorkspaceListener, DBWorkspaceReader, DBWorkspaceUserACL} from "@dev/workspace";
import {Model} from "mongoose";

export default class DBWorkspace extends DBModel<DWorkspace> {
    protected _db: Model<DWorkspace> = WorkspaceModel;

    release() {
        let obj = this.export(["_id", "user_id", "name", "content", "data", "token", "created_at", "updated_at", "viewers", "commenters", "editors"]);
        obj["can"] = this.acl().release();

        return obj;
    }

    releaseCompact(): object {
        return this.export(["_id", "user_id", "name", "content", "viewers", "commenters", "editors", "created_at", "updated_at"]);
    }

    reader() {
        return new DBWorkspaceReader(this.object);
    }

    acl(user_id: string = "") {
        return new DBWorkspaceUserACL(this.object, user_id);
    }

    on() {
        return new DBWorkspaceListener(this.object);
    }
}