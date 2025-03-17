import axios from "@configs/axios.js";

export default class CollectionService{

	static async mine(workspace_id){
		try {
			return await axios.get(`/collections?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Create new collection failed');
		}
	}

	static async create(workspace_id){
		try {
			return await axios.post('/collections', {workspace_id});
		} catch (error) {
			throw new Error(error.message || 'Create new collection failed');
		}
	}

	static async addRequest(collection){
		try {
			return await axios.post('/collections/request', {
				collection_id: collection._id,
				workspace_id: collection.workspace_id
			});
		} catch (error) {
			throw new Error(error.message || 'Create new request from collection failed');
		}
	}

	static async getById(collection_id, workspace_id){
		try {
			return await axios.get(`/collections/${collection_id}?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Create new collection failed');
		}
	}

	static async save(collection, name, content, authorization, scripts, variables){
		try {
			const data = {
				"name": name,
				"content": content,
				"authorization_type": authorization.type,
				...authorization.data,
				"variables": btoa(JSON.stringify(variables)),
				"scripts": btoa(JSON.stringify(scripts)),
				workspace_id: collection.workspace_id,
			}

			return await axios.put(`/collections/${collection._id}`, data);
		} catch (error) {
			throw new Error(error.message || 'Create new collection failed');
		}
	}

	static async delete(collection){
		try {
			return await axios.delete(`/collections/${collection._id}?workspace_id=${collection.workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Create new collection failed');
		}
	}

	static async duplicate(collection){
		try {
			return await axios.post(`/collections/${collection._id}/duplicate?workspace_id=${collection.workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Create new collection failed');
		}
	}


	static async getCollectionAssociatedWithData(collection_id, workspace_id) {
		try {
			return await axios.get(`/collections/data/${collection_id}?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Create new collection failed');
		}
	}
}