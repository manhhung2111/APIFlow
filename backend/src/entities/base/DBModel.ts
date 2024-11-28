import { Model, Document } from "mongoose";
import DBCondition from "./DBCondition";
import Code from "../../ap/code";

abstract class DBModel<T extends Model<any>> {
    protected _db: Model<T>;
    protected _object: Document | null = null;

    protected constructor() {
        this._db = this.db;
    }

    abstract release(): object;
    abstract releaseCompact(): object;
    
    public setObject(object: Document){
        this._object = object;
        return this;
    }

    public initialize(){
        this._object = new this._db();
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

    public async findOne(where: DBCondition): Promise<Document | null> {
        try {
            where.limit = where.limit ?? 1;
            return await this._db.findOne(where).exec();
        } catch (error) {
            throw new Code(error instanceof Error ? error.message : Code.UNKNOWN_ERROR);
        }
    }

    public async save(): Promise<void> {
        if (!this._object || !this._object._id) {
            throw new Code("Invalid object to be saved.");
        }

        try {
            this._object = await this._object.save();
        } catch (error) {
            throw new Code(error instanceof Error ? error.message : Code.UNKNOWN_ERROR);
        }
    }

    public async find(where: DBCondition): Promise<Document[]> {
        try {
            where.limit = where.limit ?? 30;
            return await this._db.find(where).exec();
        } catch (error) {
            throw new Code(error instanceof Error ? error.message : Code.UNKNOWN_ERROR);
        }
    }
}

export default DBModel;
