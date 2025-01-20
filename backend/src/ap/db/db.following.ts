import {DBFollowing, DBModel} from "@ap/db/index";
import {ClientSession, HydratedDocument} from "mongoose";
import {DUser} from "@db-schemas";
import DBUser from "@dev/user/user";
import logger from "@utils/logger";

export default abstract class DbFollowing<T> extends DBModel<T>{

	abstract getExport(object: any, user: HydratedDocument<DUser>): any;


	public static async setFollowing<T>(this: {new(): DbFollowing<T>}, obj: any, user_ids: string[], session: ClientSession | null = null,  overwrite = false){
		try {
			user_ids = [...new Set(user_ids)];
			let users = await Promise.all(user_ids.map(async (user_id) => {
				return await DBUser.initialize(user_id) as DBUser;
			}));

			let instance = new this();
			let error = false;
			for (let user of users){
				if (!user.good()){
					continue;
				}

				const data = instance.getExport(obj, user.object!);
				let existed = await instance._db.findOne({user_id: {$eq: data.user_id}, object_id: {$eq: data.object_id}});

				if (!overwrite) {
					// Found an object in DB and don't overwrite this object
					if (existed && !existed.isNew) {
						return true;
					}
				} else if (existed && !existed.isNew){
					// Found an object in DB and overwrite this object
					instance.object = existed;
					for (let [key, value] of Object.entries(data)){
						instance.setField(key, value);
					}
				}

				await instance.save(session);
			}

			return !error;
		} catch(error){
			logger.error((error as Error).message);
			return false;
		}
	}


	public static async resetFollowing<T>(this: {new(): DbFollowing<T>}, obj: any, user_ids: string[], session: ClientSession | null = null,  overwrite = true){
		try {
			// Remove old object
			let instance = new this();
			let error = false;
			await instance._db.deleteMany({object_id: {$eq: obj._id}}).session(session);

			// Sync new objects
			user_ids = [...new Set(user_ids)];
			let users = await Promise.all(user_ids.map(async (user_id) => {
				return await DBUser.initialize(user_id) as DBUser;
			}));

			for (let user of users){
				if (!user.good()){
					continue;
				}

				const data = instance.getExport(obj, user.object!);
				let existed = await instance._db.findOne({user_id: {$eq: data.user_id}, object_id: {$eq: data.object_id}});

				if (!overwrite) {
					// Found an object in DB and don't overwrite this object
					if (existed && !existed.isNew) {
						return true;
					}
				} else if (existed && !existed.isNew){
					// Found an object in DB and overwrite this object
					instance.object = existed;
					for (let [key, value] of Object.entries(data)){
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


	public static async removeFollowing<T>(this: {new(): DbFollowing<T>}, obj: any, session: ClientSession | null = null){
		try {
			let instance = new this();
			await instance._db.deleteMany({object_id: {$eq: obj._id}}).session(session);
			return true;
		} catch (error) {
			logger.error((error as Error).message);
			return false;
		}
	}
}