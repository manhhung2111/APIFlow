import {Model, HydratedDocument, FilterQuery} from "mongoose";

import DBCondition from "./DBCondition";
import Code from "../../ap/code";

abstract class DBModel<T> {
    protected abstract _db: Model<T>;
    protected _object: HydratedDocument<T> | null | undefined

    abstract release(): object;

    abstract releaseCompact(): object;

    public async initialize(_id: string = "") {
        if (!_id) {
            this._object = new this._db();
            return;
        }
        this._object = await this.findById(_id);
    }

    public good(): boolean {
        return this._object !== null && this._object !== undefined;
    }

    public async findById(_id: string): Promise<HydratedDocument<T> | null> {
        if (!_id) return null;

        try {
            return await this._db.findById(_id).exec();
        } catch (error) {
            if (error instanceof Error) {
                throw new Code(error.message);
            }
            throw new Code(Code.UNKNOWN_ERROR);
        }
    }

    public async findOne(condition: DBCondition): Promise<HydratedDocument<T> | null> {
        try {
            const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;
            return await this._db.findOne(
                filter, condition.projection,
                {
                    limit: condition.limit,
                    skip: condition.skip
                }
            ).sort(condition.sort);
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

    public async find(condition: DBCondition): Promise<HydratedDocument<T>[]> {
        try {
            const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;
            return await this._db.find(
                filter, condition.projection,
                {
                    limit: condition.limit,
                    skip: condition.skip
                }
            ).sort(condition.sort);
        } catch (error) {
            if (error instanceof Error) {
                throw new Code(error.message);
            }
            throw new Code(Code.UNKNOWN_ERROR);
        }
    }
}

export default DBModel;
