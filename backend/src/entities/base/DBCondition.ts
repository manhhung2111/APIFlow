type MongoDBOperator =
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
    | "$nor";

type MongoDBValue = string | number | boolean | null | RegExp | Array<string | number>;

interface MongoDBCondition {
    [field: string]:
        | MongoDBValue
        | {
        [operator in MongoDBOperator]?: MongoDBValue | MongoDBCondition | MongoDBValue[];
    }
        | MongoDBCondition; // Allows for nested queries
}

export default class DBCondition {
    public limit?: number;
    public skip?: number; // Equivalent to offset in SQL
    public sort?: { [field: string]: 1 | -1 }; // 1 for ascending, -1 for descending
    public filter?: MongoDBCondition;
}
