import {Model, Document} from "mongoose";
import DBCondition from "./DBCondition";
import Code from "../../ap/code";

abstract class DBModel<T extends Model<any>> {
    protected _db: Model<T>;
    protected _object: Document | undefined;

    protected constructor(db: Model<any>) {
        this._db = db;
    }

    abstract release(): object;

    abstract releaseCompact(): object;

    async newDocument() {
        this._object = new this._db();
        return this;
    }

    async findById(_id: string) {
        if (!_id) return null;

        try {
            let document = await this._db.findById(_id).exec();
            if (!document) return null;

            this._object = document;
            return this;
        } catch (error) {
            return null;
        }
    }

    async findOne(where: DBCondition) {
        try {
            if (!where.limit) where.limit = 1;

            return this._db.findOne(where).exec();
        } catch (error) {
            return null;
        }
    }

    async save(): Promise<Code> {
        if (!this._object || !this._object._id) {
            return Code.error("Undefined object", "Please initialize object before saving.");
        }

        try {
            let updated = await this._object.save()

            if (!updated) {
                return Code.error("Undefined object", "Please initialize object before save.");
            }

            this._object = updated;
            return Code.success("User created", "Register successfully.");
        } catch (error) {
            if (error instanceof Error) {
                return Code.error(error.name, error.message);
            }

            return Code.unknownError();
        }
    }

    async find(where: DBCondition): Promise<Document[]> {
        try {
            if (!where.limit) where.limit = 30;

            return this._db.find(where).exec();
        } catch (error) {
            return [];
        }
    }
}

export default DBModel;