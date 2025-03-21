import axios from "@configs/axios.js";

export default class PersonaService{
	static async create(workspace_id){
		try {
			return await axios.post('/personas', {workspace_id});
		} catch (error) {
			throw new Error(error.message || 'Create new persona failed');
		}
	}

	static async delete(persona){
		try {
			return await axios.delete(`/personas/${persona._id}?workspace_id=${persona.workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Delete persona failed');
		}
	}

	static async getById(persona_id, workspace_id){
		try {
			return await axios.get(`/personas/${persona_id}?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Get persona failed');
		}
	}

	static async save(persona, authorization){
		try {
			const formData = new FormData();

			formData.append("authorization_type", authorization.type);
			Object.entries(authorization.data).forEach(([key, value]) => {
				formData.append(key, value);
			});
			formData.append("workspace_id", workspace_id);

			return await axios.put(`/personas/${persona._id}`, formData);
		} catch (error) {
			throw new Error(error.message || 'Save persona failed');
		}
	}

	static async updateName(persona, name){
		try {
			const data = {
				"name": name,
				workspace_id: persona.workspace_id,
			}

			return await axios.put(`/personas/${persona._id}/name`, data);
		} catch (error) {
			throw new Error(error.message || 'Save example failed');
		}
	}

	static async duplicate(persona){
		try {
			return await axios.post(`/personas/${persona._id}/duplicate`, {workspace_id: persona.workspace_id});
		} catch (error) {
			return {
				code: -1,
				data: {},
				message: error.message || 'Duplicate persona failed',
			}
		}
	}
}