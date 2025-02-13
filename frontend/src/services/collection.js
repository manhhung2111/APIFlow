import axios from "@configs/axios.js";

export default class CollectionService{

	static async mine(workspace_id) {
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

}