import {Model, Document} from "mongoose";
import DBCondition from "./DBCondition";

abstract class DBModel<T extends Model<any>> {
    protected _db: Model<T>;
    protected _object: Document | undefined;

    protected constructor(db: Model<any>) {
        this._db = db;
    }

    abstract release(): object;

    abstract releaseCompact(): object;

    async findOne(_id: string = "") {
        if (_id) {
            let document = await this._db.findById(_id).exec();
            if (document) {
                this._object = document;
            } else {
                return null;
            }
        } else {
            return null;
        }

        return this;
    }

    async newDocument() {
        this._object = new this._db();
        return this;
    }

    async save(): Promise<boolean> {
        if (!this._object) {
            return false;
        }

        try {
            if (!this._object._id) {
                console.error("Please initialize object before saving...");
                return false;
            } else {
                let updated = await this._object.save()

                if (!updated) {
                    console.log(`Is updated: ${updated}`);
                    return false;
                }
                this._object = updated;
            }
            return true;
        } catch (error) {
            console.error("Error saving object:", error);
            return false;
        }
    }

    async find(where: DBCondition): Promise<Document[]> {
        if (!where.limit) where.limit = 30;

        return this._db.find(where).exec();
    }
}

export default DBModel;