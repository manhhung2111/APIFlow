import axios from "@configs/axios.js";

export default class WorkspaceService {
	static async mine() {
		try {
			return await axios.get('/workspaces');
		} catch (error) {
			throw new Error(error.message || 'Register failed');
		}
	}
}
