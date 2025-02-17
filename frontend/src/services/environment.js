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
}