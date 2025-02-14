import axios from "@configs/axios.js";

export default class RequestService {
	static async mine(workspace_id) {
		try {
			return await axios.get(`/requests?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Get requests failed');
		}
	}
}