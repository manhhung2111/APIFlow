import axios from "@configs/axios.js";

export default class FolderService {

	static async mine(workspace_id) {
		try {
			return await axios.get(`/folders?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Get folders failed');
		}
	}

	static async create(collection) {
		try {
			return await axios.post('/folders', {collection_id: collection._id, workspace_id: collection.workspace_id});
		} catch (error) {
			throw new Error(error.message || 'Create new folder failed');
		}
	}
}