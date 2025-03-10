import {SortOrder} from "mongoose";

/**
 * Comprehensive type for MongoDB query operators
 */
export type MongoDBOperator =
	| "$eq"
	| "$ne"
	| "$gt"
	| "$gte"
	| "$lt"
	| "$lte"
	| "$in"
	| "$nin"
	| "$exists"
	| "$regex"
	| "$and"
	| "$or"
	| "$not"
	| "$nor"
	| "$all"
	| "$elemMatch";

/**
 * Expanded type for values that can be used in MongoDB queries
 */
export type MongoDBValue =
	| string
	| number
	| boolean
	| null
	| RegExp
	| Date
	| Array<string | number | boolean>
	| {[key: string]: any};

/**
 * Recursive type for MongoDB query conditions
 */
export type MongoDBCondition = {
	[field: string]:
		| MongoDBValue
		| {
		[operator in MongoDBOperator]?:
		| MongoDBValue
		| MongoDBCondition
		| MongoDBValue[]
		| MongoDBCondition[];
	}
		| MongoDBCondition;
};

/**
 * Comprehensive query options for database operations
 */
export interface DBConditionOptions{
	/**
	 * Maximum number of documents to return
	 */
	limit?: number;

	/**
	 * Number of documents to skip (for pagination)
	 */
	skip?: number;

	/**
	 * Sorting configuration
	 * Use mongoose SortOrder for type safety
	 */
	sort?: {[field: string]: SortOrder};

	/**
	 * Query filter conditions
	 */
	filter?: MongoDBCondition;

	/**
	 * Projection to specify which fields to include or exclude
	 */
	projection?: {[field: string]: 0 | 1};
}

/**
 * Utility class for constructing database queries
 */
export default class DbCondition implements DBConditionOptions{
	public limit?: number;
	public skip?: number;
	public sort?: {[field: string]: SortOrder};
	public filter?: MongoDBCondition;
	public projection?: {[field: string]: 0 | 1};

	/**
	 * Create a new DBCondition instance
	 * @param options Optional initial query configuration
	 */
	constructor(options?: Partial<DBConditionOptions>){
		if (options){
			this.limit = options.limit;
			this.skip = options.skip;
			this.sort = options.sort;
			this.filter = options.filter;
			this.projection = options.projection;
		}
	}

	/**
	 * Set the maximum number of documents to return
	 * @param limit Number of documents
	 * @returns Current instance for method chaining
	 */
	setLimit(limit: number): this{
		this.limit = limit;
		return this;
	}

	/**
	 * Set the number of documents to skip
	 * @param skip Number of documents to skip
	 * @returns Current instance for method chaining
	 */
	setSkip(skip: number): this{
		this.skip = skip;
		return this;
	}

	/**
	 * Set sorting configuration
	 * @param sort Sorting object
	 * @returns Current instance for method chaining
	 */
	setSort(sort: {[field: string]: SortOrder}): this{
		this.sort = sort;
		return this;
	}

	/**
	 * Set query filter conditions
	 * @param filter MongoDB query conditions
	 * @returns Current instance for method chaining
	 */
	setFilter(filter: MongoDBCondition): this{
		this.filter = filter;
		return this;
	}

	/**
	 * Set projection to specify which fields to include or exclude
	 * @param projection Projection object
	 * @returns Current instance for method chaining
	 */
	setProjection(projection: {[field: string]: 0 | 1}): this{
		this.projection = projection;
		return this;
	}
}