import {DBModel} from "@ap/db";
import RequestModel from "@models/request";
import {DRequest} from "@db-schemas";
import {DBRequestListener, DBRequestReader} from "@dev/request";
import {Model} from "mongoose";
import {Code, HTMLInput} from "@ap/core";
import {DBCollection} from "@dev/collection";
import HuggingFaceEmbeddingService from "@services/ai/hugging.face";

export default class DBRequest extends DBModel<DRequest> {
    protected _db: Model<DRequest> = RequestModel;

    release(): object {
        return this.export(["_id", "user_id", "workspace_id", "collection_id", "folder_id", "name",
            "content", "method", "url", "params", "headers", "authorization", "body", "scripts",
            "tag", "data", "token", "created_at", "updated_at"]);
    }

    releaseCompact(): object {
        return this.export(["_id", "user_id", "workspace_id", "collection_id", "folder_id", "name", "method", "created_at", "updated_at"]);
    }

    reader() {
        return new DBRequestReader(this.object);
    }

    on() {
        return new DBRequestListener(this.object);
    }

    public static async searchVector(query: string) {
        const vector = await HuggingFaceEmbeddingService.embedText(query);
        const results = await RequestModel.aggregate([
            {
                "$vectorSearch": {
                    "index": "NameDescSemanticSearch",
                    "path": "embedding",
                    "queryVector": vector,
                    "numCandidates": 10,
                    "limit": 1
                }
            },
            {
                "$project": {
                    "name": 1,  // Include the 'object.name' field
                    "content": 1, // Include the 'object.content' field
                    "_id": 1  // Include _id (optional)
                }
            }
        ])

        return results.length == 0 ? null : results[0];
    }
}