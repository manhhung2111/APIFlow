import axios from "@configs/axios.js";

export default class FolderService{

	static async mine(workspace_id){
		try {
			return await axios.get(`/folders?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Get folders failed');
		}
	}

	static async addRequest(folder){
		try {
			return await axios.post(`/folders/request`, {
				folder_id: folder._id,
				collection_id: folder.collection_id,
				workspace_id: folder.workspace_id
			});
		} catch (error) {
			throw new Error(error.message || 'Get folders failed');
		}
	}

	static async create(collection){
		try {
			return await axios.post('/folders', {collection_id: collection._id, workspace_id: collection.workspace_id});
		} catch (error) {
			throw new Error(error.message || 'Create new folder failed');
		}
	}
}