import {ClientSession, FilterQuery, HydratedDocument, Model} from "mongoose";
import {DBCondition} from "@ap/db";
import {Code, Validation} from "@ap/core";

abstract class DBModel<T>{
	public static PAGE_SIZE = 500;
	public object: HydratedDocument<T> | null | undefined;
	protected abstract _db: Model<T>;

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
			throw new Code((error as Error).message);
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
			throw new Code((error as Error).message);
		}
	}

	public static async find<T>(
		this: { new(): DBModel<T> },
		condition: DBCondition | null = null
	): Promise<DBModel<T>[]> {
		try {
			const instance = new this();

			// If condition is null, load all documents with no restrictions
			const filter: FilterQuery<T> = condition?.filter as FilterQuery<T> || {};
			const projection = condition?.projection || {};
			const limit = condition?.limit ?? 0; // 0 means no limit (load all)
			const skip = condition?.skip ?? 0; // Default: 0 (no skipping)
			const sort = condition?.sort || {}; // No sorting if not specified

			const query = instance._db.find(filter, projection);

			// Apply optional query modifications
			if (limit > 0) query.limit(limit);
			if (skip > 0) query.skip(skip);
			if (Object.keys(sort).length > 0) query.sort(sort);

			const documents = await query.exec();

			return documents.map((doc) => {
				const obj = new this();
				obj._setObject(doc);
				return obj;
			});
		} catch (error) {
			throw new Code((error as Error).message);
		}
	}


	public static async count<T>(
		this: { new(): DBModel<T> },
		condition: DBCondition | null = null
	): Promise<number> {
		try {
			const instance = new this();

			// If condition is null, load all documents with no restrictions
			const filter: FilterQuery<T> = condition?.filter as FilterQuery<T> || {};
			const limit = condition?.limit ?? 0; // 0 means no limit (load all)
			const skip = condition?.skip ?? 0; // Default: 0 (no skipping)
			const sort = condition?.sort || {}; // No sorting if not specified

			const query = instance._db.countDocuments(filter);
			return await query.exec();
		} catch (error) {
			throw new Code((error as Error).message);
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
			throw new Code((error as Error).message);
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
			throw new Code((error as Error).message);
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
			throw new Code((error as Error).message);
		}
	}

	abstract release(): object;

	public good(): boolean{
		return this.object !== null && this.object !== undefined;
	}

	public async save(session: ClientSession | null = null){
		if (!this.object){
			throw new Code("Invalid object to be saved.");
		}

		try{
			if (session){
				return await this.object.save({session});
			}
			return await this.object.save();
		} catch (error){
			throw new Code((error as Error).message);
		}
	}

	public async delete(session: ClientSession | null = null){
		if (!this.object){
			throw new Code("Invalid object to be deleted.");
		}

		try{
			if (session){
				return await this.object.deleteOne({session});
			}
			return await this.object.deleteOne();
		} catch (error){
			throw new Code((error as Error).message);
		}
	}

	public getField(field: string){
		if (!this.object) return "";
		return this.object.get(field);
	}


	public setField(key: string, value: any){
		if (!this.object) return;
		this.object.set(key, value);
	}


	protected export(fields: Array<string>) {
		let data: Record<string, any> = {};

		if (!this.good()) return data;

		for (const field of fields){
			if (field in this.object!.toObject()){
				if (field == "_id") {
					data[field] = this.object!.get(field).toString();
				} else {
					data[field] = this.object!.get(field);
				}
			}
		}

		return data;
	}

	private _setObject(obj: HydratedDocument<T> | null): void{
		this.object = obj;
	}

	private _validCondition(condition: DBCondition): void{
		if (Validation.isEmpty(condition.filter)){
			throw new Code("Empty filter is passed when calling delete operation.");
		}
		// Other logic
	}
}

export default DBModel;
