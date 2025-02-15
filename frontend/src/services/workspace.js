import axios from "@configs/axios.js";

export default class WorkspaceService {
	static async mine() {
		try {
			return await axios.get('/workspaces');
		} catch (error) {
			throw new Error(error.message || 'Get workspaces failed');
		}
	}

	static async create(name, content = "") {
		try {
			return await axios.post('/workspaces', {name: name, content});
		} catch (error) {
			throw new Error(error.message || 'Create workspace failed');
		}
	}


	static async getById(id) {
		try {
			return await axios.get(`/workspaces/${id}`);
		} catch (error) {
			throw new Error(error.message || 'Create workspace failed');
		}
	}


	static async save(workspace, name, content) {
		try {
			return await axios.put(`/workspaces/${workspace._id}`, {name, content});
		} catch (error) {
			throw new Error(error.message || 'Create workspace failed');
		}
	}
}
