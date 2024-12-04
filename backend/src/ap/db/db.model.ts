import {ClientSession, FilterQuery, HydratedDocument, Model} from "mongoose";
import {DBCondition} from "@ap/db";
import {Code, Validation} from "@ap/core";

abstract class DBModel<T>{
	protected abstract _db: Model<T>;
	public _object: HydratedDocument<T> | null | undefined;

	abstract release(): object;

	public async initialize(_id: string = ""){
		if (!_id){
			this._object = new this._db();
			return;
		}
		this._object = await this.findById(_id);
	}

	public good(): boolean{
		return this._object !== null && this._object !== undefined;
	}

	public async save(): Promise<void>{
		if (!this._object){
			throw new Code("Invalid object to be saved.");
		}

		try{
			await this._object.save();
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public async delete(): Promise<void>{
		if (!this._object){
			throw new Code("Invalid object to be deleted.");
		}

		try{
			await this._object.deleteOne();
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public async findById(_id: string): Promise<HydratedDocument<T> | null>{
		if (!_id) return null;

		try{
			return await this._db.findById(_id).exec();
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public async findOne(condition: DBCondition): Promise<HydratedDocument<T> | null>{
		try{
			const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;
			return await this._db.findOne(
				filter, condition.projection,
				{
					limit: condition.limit,
					skip: condition.skip,
				},
			).sort(condition.sort);
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public async find(condition: DBCondition): Promise<HydratedDocument<T>[]>{
		try{
			const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;
			return await this._db.find(
				filter, condition.projection,
				{
					limit: condition.limit,
					skip: condition.skip,
				},
			).sort(condition.sort);
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public async deleteOne(condition: DBCondition, session: ClientSession | null = null){
		try{
			this.validCondition(condition);
			const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;

			if (session){
				return await this._db.deleteOne(filter).session(session);
			}
			return await this._db.deleteOne(filter);
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public async deleteMany(condition: DBCondition, session: ClientSession | null = null){
		try{
			this.validCondition(condition);
			const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;

			if (session){
				return await this._db.deleteMany(filter).session(session);
			}
			return await this._db.deleteMany(filter);
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	protected export(fields: Array<string>): object{
		let data: Record<string, any> = {};

		if (!this._object) return data;

		for (const field of fields){
			if (field in this._object.schema.paths){
				data[field] = this._object[field as keyof typeof this._object];
			}
		}

		return data;
	}

	private validCondition(condition: DBCondition): void{
		if (Validation.isEmpty(condition.filter)){
			throw new Code("Empty filter is passed when calling delete operation.");
		}
		// Other logic
	}
}

export default DBModel;
