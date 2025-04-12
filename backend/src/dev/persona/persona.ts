import {DBModel} from "@ap/db";
import {DPersona} from "@db-schemas";
import {Model} from "mongoose";
import PersonaModel from "@models/persona";
import {DBPersonaReader} from "@dev/persona/index";

export default class DBPersona extends DBModel<DPersona> {
    protected _db: Model<DPersona> = PersonaModel;

    release(): object {
        return this.export(["_id", "user_id", "workspace_id", "name", "authorization", "data", "token", "created_at", "updated_at"]);
    }

    releaseCompact(): object {
        return this.export(["_id", "user_id", "workspace_id", "name"]);
    }

    reader() {
        return new DBPersonaReader(this.object);
    }
}