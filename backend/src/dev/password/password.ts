import {DBModel} from "@ap/db";
import {DPasswordResetToken} from "@db-schemas";
import {Model} from "mongoose";
import PasswordResetToken from "@models/password.reset.token";

export default class DBPasswordResetToken extends DBModel<DPasswordResetToken> {
    protected _db: Model<DPasswordResetToken> = PasswordResetToken;

    release(): object {
        return this.export(["_id", "user_id", "token", "token_expiry", "created_at", "updated_at"]);
    }

}