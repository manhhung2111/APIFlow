import {DBListener} from "@ap/db";
import {ClientSession, HydratedDocument} from "mongoose";
import {DFolder} from "@db-schemas";
import {DBRequest, DBRequestLoader} from "@dev/request";
import {DBFolder} from "@dev/folder";
import DbCondition from "@ap/db/db.condition";
import {DBExample} from "@dev/example";

export default class Listener extends DBListener<DFolder> {

    constructor(obj: HydratedDocument<DFolder> | null | undefined) {
        super(obj);
    }

    public async deleted(session: ClientSession | null) {
        const folder_id = this._obj!._id.toString();
        const workspace_id = this._obj!.workspace_id.toString();
        const collection_id = this._obj!.collection_id.toString();

        const condition = new DbCondition().setFilter({
            "workspace_id": workspace_id,
            "collection_id": collection_id,
            "folder_id": folder_id
        });

        await DBRequest.deleteMany(condition, session);
        await DBExample.deleteMany(condition, session);

        // const requests = await DBRequestLoader.byFolder(this._obj!);
        //
        // for (let request of requests){
        // 	await request.delete(session);
        //
        // 	await request.on().deleted(session);
        // }
    }

    async duplicated(old_folder: DBFolder) {
        const old_requests = await DBRequestLoader.byFolder(old_folder.object!);

        const new_requests: DBRequest[] = [];
        let new_examples: DBExample[] = [];
        for (const old_request of old_requests) {
            const new_request = await DBRequest.initialize() as DBRequest;

            await new_request.reader().duplicate(old_request);
            new_request.object!.collection_id = this._obj!.collection_id;
            new_request.object!.folder_id = this._obj!._id.toString();

            new_requests.push(new_request);
            const examples = await new_request.on().duplicated(old_request);
            new_examples.push(...examples);
        }

        return {
            requests: new_requests,
            examples: new_examples,
        };
    }
}