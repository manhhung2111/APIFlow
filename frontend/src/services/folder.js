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


	static async getById(folder_id, workspace_id) {
		try {
			return await axios.get(`/folders/${folder_id}?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Get folder by id failed');
		}
	}

	static async save(folder, name, content, authorization, scripts){
		try {
			const data = {
				"name": name,
				"content": content,
				"authorization_type": authorization.type,
				...authorization.data,
				"scripts": btoa(JSON.stringify(scripts)),
				workspace_id: folder.workspace_id,
			}

			return await axios.put(`/folders/${folder._id}`, data);
		} catch (error) {
			throw new Error(error.message || 'Save folder failed');
		}
	}


	static async delete(folder){
		try {
			return await axios.delete(`/folders/${folder._id}?workspace_id=${folder.workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Delete folder failed');
		}
	}


	static async duplicate(folder) {
		try {
			return await axios.post(`/folders/${folder._id}/duplicate?workspace_id=${folder.workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Create new folder failed');
		}
	}
}