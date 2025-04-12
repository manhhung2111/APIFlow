import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DCollection} from "@db-schemas";
import {DBFolder, DBFolderLoader} from "@dev/folder";
import {DBRequest, DBRequestLoader} from "@dev/request";
import {DBCollection} from "@dev/collection";
import DbCondition from "@ap/db/db.condition";
import {DBExample} from "@dev/example";

export default class Listener extends DBListener<DCollection> {

    constructor(obj: HydratedDocument<DCollection> | null | undefined) {
        super(obj);
    }

    public async deleted(session: ClientSession | null = null) {
        const collection_id = this._obj!._id.toString();
        const workspace_id = this._obj!.workspace_id.toString();

        const condition = new DbCondition().setFilter({"workspace_id": workspace_id, "collection_id": collection_id});

        await DBFolder.deleteMany(condition, session);
        await DBRequest.deleteMany(condition, session);
        await DBExample.deleteMany(condition, session);

        /**
         *
         The old way of delete 1 by 1
         const folders = await DBFolderLoader.byCollection(this._obj!);
         for (const folder of folders){
         await folder.delete(session);

         await folder.on().deleted(session);
         }

         const requests = await DBRequestLoader.byCollectionWithoutFolder(this._obj!);
         for (const request of requests){
         await request.delete(session);

         await request.on().deleted(session);
         }
         */
    }

    public async duplicated(old_collection: DBCollection) {
        const folders = await DBFolderLoader.byCollection(old_collection.object!);

        let new_folders: DBFolder[] = [];
        let new_requests: DBRequest[] = [];
        let new_examples: DBExample[] = [];

        for (const folder of folders) {
            const new_folder = await DBFolder.initialize() as DBFolder;

            await new_folder.reader().duplicate(folder);
            new_folder.object!.collection_id = this._obj!._id.toString();

            new_folders.push(new_folder);

            const {requests, examples} = await new_folder.on().duplicated(folder);
            new_requests.push(...requests);
            new_examples.push(...examples);
        }

        const requests = await DBRequestLoader.byCollectionWithoutFolder(this._obj!);
        for (const request of requests) {
            const new_request = await DBRequest.initialize() as DBRequest;

            await new_request.reader().duplicate(request);
            new_request.object!.collection_id = this._obj!._id.toString();

            new_requests.push(new_request);
            const examples = await new_request.on().duplicated(request);
            new_examples.push(...examples);
        }

        return {
            folders: new_folders,
            requests: new_requests,
            examples: new_examples,
        };
    }
}