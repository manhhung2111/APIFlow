import {DBCondition, DBModel} from "@ap/db";
import {DUser, DWorkspace, DWorkspaceFollowing} from "@db-schemas";
import WorkspaceFollowingModel from "@models/workspace.following";
import {ClientSession, HydratedDocument, Model} from "mongoose";
import DBUser from "../../user/user";
import logger from "@utils/logger";
import {DBWorkspaceFollowing} from "@dev/workspace";
import UUID from "@utils/uuid";

export default class WorkspaceFollowing extends DBModel<DWorkspaceFollowing> {
    protected _db: Model<DWorkspaceFollowing> = WorkspaceFollowingModel;

    release() {
        return this.export(["_id", "user_id", "creator_id", "workspace_id", "name", "content", "viewing", "commenting", "editing", "viewers", "commenters", "editors", "token"]);
    }

    public static getExport(workspace: HydratedDocument<DWorkspace>, user: HydratedDocument<DUser>) {
        const workspace_admin = workspace.user_id == user._id.toString();
        const editing = workspace.editors.includes(user._id.toString()) || workspace_admin;
        const commenting = workspace.commenters.includes(user._id.toString()) || editing || workspace_admin;
        const viewing = workspace.viewers.includes(user._id.toString()) || commenting || editing || workspace_admin;

        return {
            "user_id": user._id,
            "creator_id": workspace.user_id,
            "object_id": workspace._id,
            "name": workspace.name,
            "content": workspace.content,
            "viewing": viewing,
            "commenting": commenting,
            "editing": editing,
            "viewers": workspace.viewers,
            "commenters": workspace.commenters,
            "editors": workspace.editors,
        };
    }

    public static async setFollowing(obj: HydratedDocument<DWorkspace>, user_ids: string[], session: ClientSession | null = null, overwrite = false) {
        try {
            user_ids = [...new Set(user_ids)];
            let users = await Promise.all(user_ids.map(async (user_id) => {
                return await DBUser.initialize(user_id) as DBUser;
            }));

            let error = false;
            for (let user of users) {
                if (!user.good()) {
                    continue;
                }

                const data = this.getExport(obj, user.object!);
                let existed = await this.findOne(new DBCondition().setFilter({
                    user_id: {$eq: data.user_id},
                    object_id: {$eq: data.object_id}
                })) as DBWorkspaceFollowing;

                let instance = await DBWorkspaceFollowing.initialize();

                if (!overwrite) {
                    // Found an object in DB and don't overwrite this object
                    if (existed.good() && !existed.object!.isNew) {
                        return true;
                    } else {
                        for (let [key, value] of Object.entries(data)) {
                            instance.setField(key, value);
                        }
                    }

                    if (instance.object?.isNew) {
                        instance.object.token = UUID.randomTokenSize32();
                    }
                } else {
                    // Found an object in DB and overwrite this object
                    instance.object = existed.object;
                    for (let [key, value] of Object.entries(data)) {
                        instance.setField(key, value);
                    }
                }

                await instance.save(session);
            }

            return !error;
        } catch (error) {
            logger.error((error as Error).message);
            return false;
        }
    }

    public static async resetFollowing(obj: HydratedDocument<DWorkspace>, user_ids: string[], session: ClientSession | null = null, overwrite = true) {
        // Remove old object
        await this.removeFollowing(obj, session);

        // Sync new objects
        await this.setFollowing(obj, user_ids, session, overwrite);
    }


    public static async removeFollowing(obj: HydratedDocument<DWorkspace>, session: ClientSession | null = null) {
        await this.deleteMany(new DBCondition().setFilter({
            object_id: {$eq: obj._id.toString()},
        }), session);
    }
}