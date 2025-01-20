import {DBCondition} from "@ap/db";
import Client from "@dev/client";
import {HTMLInput, Validation} from "@ap/core";
import {DBWorkspace, DBWorkspaceFollowing} from "@dev/workspace";

export default class Loader{
	public static async mine(){
		const sc = new DBCondition().setFilter({
			creator_id: {$eq: Client.viewer._id.toString()},
		}).setLimit(DBWorkspace.PAGE_SIZE);

		let page_query = HTMLInput.query("page");
		if (!Validation.isInt(page_query) || Number(page_query) <= 0){
			sc.setSkip(0);
		} else{
			sc.setSkip((Number(page_query) - 1) * DBWorkspace.PAGE_SIZE);
		}

		return await DBWorkspaceFollowing.find(sc) as DBWorkspaceFollowing[];
	}

	public static async workspaces(){
		const sc = new DBCondition().setFilter({
			user_id: {$eq: Client.viewer._id.toString()},
		}).setLimit(DBWorkspace.PAGE_SIZE);

		let page_query = HTMLInput.query("page");
		if (!Validation.isInt(page_query) || Number(page_query) <= 0){
			sc.setSkip(0);
		} else{
			sc.setSkip((Number(page_query) - 1) * DBWorkspace.PAGE_SIZE);
		}

		return await DBWorkspaceFollowing.find(sc) as DBWorkspaceFollowing[];
	}

}