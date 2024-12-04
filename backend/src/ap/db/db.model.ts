import {ClientSession, FilterQuery, HydratedDocument, Model} from "mongoose";
import {DBCondition} from "@ap/db";
import {Code, Validation} from "@ap/core";

abstract class DBModel<T>{
	protected abstract _db: Model<T>;

	public _object: HydratedDocument<T> | null | undefined;
	public static PAGE_SIZE = 200;

	abstract release(): object;

	public static async initialize<T>(this: new () => DBModel<T>, _id: string = ""){
		try{
			let instance = new this();
			let document: HydratedDocument<T> | null = new instance._db();
			if (_id){
				document = await instance._db.findById(_id).exec();
			}
			instance._setObject(document);
			return instance;
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public static async findOne<T>(this: {new(): DBModel<T>}, condition: DBCondition){
		try{
			const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;
			let instance = new this();
			const document = await instance._db.findOne(
				filter, condition.projection,
				{
					limit: condition.limit,
					skip: condition.skip,
				},
			).sort(condition.sort);

			instance._setObject(document);
			return instance;
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public static async find<T>(this: {new(): DBModel<T>}, condition: DBCondition): Promise<DBModel<T>[]>{
		try{
			const instance = new this(); // Create an instance of the derived class
			const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;

			const documents = await instance._db
				.find(filter, condition.projection, {
					limit: condition.limit,
					skip: condition.skip,
				})
				.sort(condition.sort).exec();

			return documents.map((doc) => {
				const obj = new this();
				obj._setObject(doc);
				return obj;
			});
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public static async deleteOne<T>(this: {
		new(): DBModel<T>
	}, condition: DBCondition, session: ClientSession | null = null){
		try{
			const derived_class = new this();
			derived_class._validCondition(condition);
			const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;

			if (session){
				return derived_class._db.deleteOne(filter).session(session);
			}
			return await derived_class._db.deleteOne(filter);
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public static async deleteMany<T>(this: {
		new(): DBModel<T>
	}, condition: DBCondition, session: ClientSession | null = null){
		try{
			const derived_class = new this();
			derived_class._validCondition(condition);

			const filter: FilterQuery<T> = condition.filter as FilterQuery<T>;

			if (session){
				return derived_class._db.deleteMany(filter).session(session);
			}
			return await derived_class._db.deleteMany(filter);
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public static async insertMany<T>(this: {
		new(): DBModel<T>
	}, documents: HydratedDocument<T>[], session: ClientSession | null = null){
		try{
			const derived_class = new this();

			if (session){
				return derived_class._db.insertMany(documents, {session});
			}
			return await derived_class._db.insertMany(documents);
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public good(): boolean{
		return this._object !== null && this._object !== undefined;
	}

	public async save(session: ClientSession | null = null){
		if (!this._object){
			throw new Code("Invalid object to be saved.");
		}

		try{
			if (session){
				return await this._object.save({session});
			}
			return await this._object.save();
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public async delete(session: ClientSession | null = null){
		if (!this._object){
			throw new Code("Invalid object to be deleted.");
		}

		try{
			if (session){
				return await this._object.deleteOne({session});
			}
			return await this._object.deleteOne();
		} catch (error){
			if (error instanceof Error){
				throw new Code(error.message);
			}
			throw new Code(Code.UNKNOWN_ERROR);
		}
	}

	public getField(field: string){
		if (!this._object) return "";
		return this._object.get(field);
	}

	protected export(fields: Array<string>): object{
		let data: Record<string, any> = {};

		if (!this.good()) return data;

		for (const field of fields){
			if (field in this._object!.schema.paths){
				data[field] = this._object![field as keyof typeof this._object];
			}
		}

		return data;
	}

	private _setObject(obj: HydratedDocument<T> | null): void{
		this._object = obj;
	}

	private _validCondition(condition: DBCondition): void{
		if (Validation.isEmpty(condition.filter)){
			throw new Code("Empty filter is passed when calling delete operation.");
		}
		// Other logic
	}
}

export default DBModel;
