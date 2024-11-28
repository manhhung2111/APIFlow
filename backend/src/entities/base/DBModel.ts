import { Model, Document } from "mongoose";
import DBCondition from "./DBCondition";
import Code from "../../ap/code";

abstract class DBModel {
    protected abstract _db: Model<any>;
    protected _object: Document | null = null;

    abstract release(): object;
    abstract releaseCompact(): object;

    public async initialize(_id: string = ""){
        if (!_id) {
            this._object = new this._db();
            return;
        }
        this._object = await this.findById(_id);
    }

    public good(): boolean {
        return this._object !== null;
    }

    public async findById(_id: string): Promise<Document | null> {
        if (!_id) return null;

        try {
            return await this._db.findById(_id).exec();
        } catch (error) {
            throw new Code(error instanceof Error ? error.message : Code.UNKNOWN_ERROR);
        }
    }

    public async findOne(condition: DBCondition): Promise<Document | null> {
        try {
            condition.limit = condition.limit ?? 1;
            return await this._db.findOne(condition.filter).exec();
        } catch (error) {
            if (error instanceof Error) {
                throw new Code(error.message);
            }
            throw new Code(Code.UNKNOWN_ERROR);
        }
    }

    public async save(): Promise<void> {
        if (!this._object || !this._object._id) {
            throw new Code("Invalid object to be saved.");
        }

        try {
            await this._object.save();
        } catch (error) {
            if (error instanceof Error) {
                throw new Code(error.message);
            }
            throw new Code(Code.UNKNOWN_ERROR);
        }
    }

    public async find(condition: DBCondition): Promise<Document[]> {
        try {
            condition.limit = condition.limit ?? 30;
            if (!condition.filter) {
                throw new Code("Please add filter for query")
            }
            return await this._db.find(condition.filter).exec();
        } catch (error) {
            if (error instanceof Error) {
                throw new Code(error.message);
            }
            throw new Code(Code.UNKNOWN_ERROR);
        }
    }
}

export default DBModel;
