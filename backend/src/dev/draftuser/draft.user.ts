import { DBModel } from "@ap/db";
import UserModel from "@models/user";
import { DDraftUser, DUser } from "@db-schemas";
import { DBUserReader } from "@dev/user";
import { Model } from "mongoose";
import DraftUserModel from "@models/draft.user";
import { DBDraftUserReader } from ".";

export default class DBDraftUser extends DBModel<DDraftUser> {
    protected _db: Model<DDraftUser> = DraftUserModel;

    release(): object {
        return this.export([
            "_id",
            "email",
            "data",
            "created_at",
            "updated_at",
        ]);
    }

    releaseCompact(): object {
        return this.export(["_id", "email"]);
    }

    reader() {
        return new DBDraftUserReader(this.object);
    }
}
