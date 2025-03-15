import axios from "@configs/axios.js";

export default class EnvironmentService{

	static async mine(){

	}

	static async create(workspace_id){
		try {
			return await axios.post('/environments', {workspace_id});
		} catch (error) {
			throw new Error(error.message || 'Create new environment failed');
		}
	}

	static async delete(environment) {
		try {
			return await axios.delete(`/environments/${environment._id}?workspace_id=${environment.workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Delete environment failed');
		}
	}

	static async getById(environment_id, workspace_id) {
		try {
			return await axios.get(`/environments/${environment_id}?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Delete environment failed');
		}
	}

	static async save(environment, variables) {
		try {
			const data = {
				"variables": btoa(JSON.stringify(variables)),
				workspace_id: environment.workspace_id,
			}

			return await axios.put(`/environments/${environment._id}`, data);
		} catch (error) {
			throw new Error(error.message || 'Save environment failed');
		}
	}

	static async updateName(environment, name) {
		try {
			const data = {
				"name": name,
				workspace_id: environment.workspace_id,
			}

			return await axios.put(`/environments/${environment._id}/name`, data);
		} catch (error) {
			throw new Error(error.message || 'Save example failed');
		}
	}
}