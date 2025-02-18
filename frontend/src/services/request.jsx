import axios from "@configs/axios.js";

export default class RequestService {
	static async mine(workspace_id) {
		try {
			return await axios.get(`/requests?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Get requests failed');
		}
	}

	static async getById(request_id, workspace_id) {
		try {
			return await axios.get(`/requests/${request_id}?workspace_id=${workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Get request by id failed');
		}
	}


	static async save(request, method, url, params, authorization, headers, body, scripts) {
		try {
			const data = {
				"method": method,
				"url": url,
				"authorization_type": authorization.type,
				...authorization.data,
				"params": btoa(JSON.stringify(params)),
				"headers": btoa(JSON.stringify(headers)),
				"scripts": btoa(JSON.stringify(scripts)),
				"body_type": body.type,
				"body_data": btoa(JSON.stringify(body.data)),
				workspace_id: request.workspace_id,
			}

			return await axios.put(`/requests/${request._id}`, data);
		} catch (error) {
			throw new Error(error.message || 'Save request failed');
		}
	}


	static async delete(request) {
		try {
			return await axios.delete(`/requests/${request._id}?workspace_id=${request.workspace_id}`);
		} catch (error) {
			throw new Error(error.message || 'Delete request failed');
		}
	}
}