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
			const formData = new FormData();

			formData.append("method", method);
			formData.append("url", url);
			formData.append("authorization_type", authorization.type);

			Object.entries(authorization.data).forEach(([key, value]) => {
				formData.append(key, value);
			});

			formData.append("params", btoa(JSON.stringify(params)));
			formData.append("headers", btoa(JSON.stringify(headers)));
			formData.append("scripts", btoa(JSON.stringify(scripts)));

			formData.append("body_type", body.type);
			formData.append("body_data", btoa(JSON.stringify(body.data)));

			formData.append("workspace_id", request.workspace_id);

			// Add files if exists
			body.data.form_data.forEach((row, index) => {
				if (row.type === "file") {
					if (row.value && Object.keys(row.value)) {
						formData.append(`form_data_value_${index}`, row.value);
					}
				}
			});

			return await axios.put(`/requests/${request._id}`, formData);
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

	static async updateName(request, name) {
		try {
			const data = {
				"name": name,
				workspace_id: request.workspace_id,
			}

			return await axios.put(`/requests/${request._id}/name`, data);
		} catch (error) {
			throw new Error(error.message || 'Save request failed');
		}
	}

	static async send(request, method, url, params, authorization, headers, body, scripts, active_environment) {
		try {
			const formData = new FormData();

			formData.append("method", method);
			formData.append("url", url);
			formData.append("authorization_type", authorization.type);

			Object.entries(authorization.data).forEach(([key, value]) => {
				formData.append(key, value);
			});

			formData.append("params", btoa(JSON.stringify(params)));
			formData.append("headers", btoa(JSON.stringify(headers)));
			formData.append("scripts", btoa(JSON.stringify(scripts)));

			formData.append("body_type", body.type);
			formData.append("body_data", btoa(JSON.stringify(body.data)));

			formData.append("workspace_id", request.workspace_id);

			// Add files if exists
			body.data.form_data.forEach((row, index) => {
				if (row.type === "file") {
					if (row.value && Object.keys(row.value)) {
						formData.append(`form_data_value_${index}`, row.value);
					}
				}
			});

			formData.append("active_environment", active_environment);
			return await axios.post(`/requests/${request._id}/send`, formData);
		} catch (error) {
			throw new Error(error.message || 'Send request failed');
		}
	}


	static async saveExample(request, method, url, params, headers, body, response) {
		try {
			const formData = new FormData();

			formData.append("method", method);
			formData.append("url", url);
			formData.append("name", request.name);

			formData.append("params", btoa(JSON.stringify(params)));
			formData.append("headers", btoa(JSON.stringify(headers)));

			formData.append("body_type", body.type);
			formData.append("body_data", btoa(JSON.stringify(body.data)));

			formData.append("workspace_id", request.workspace_id);

			// Add files if exists
			body.data.form_data.forEach((row, index) => {
				if (row.type === "file") {
					if (row.value && Object.keys(row.value)) {
						formData.append(`form_data_value_${index}`, row.value);
					}
				}
			});

			formData.append("response", btoa(JSON.stringify(response)));

			return await axios.post(`/requests/${request._id}/examples`, formData);
		} catch (error) {
			throw new Error(error.message || 'Save request failed');
		}
	}

	static async addExample(request) {
		try {
			return await axios.post(`/requests/${request._id}/add.examples`, {request_id: request._id, workspace_id: request.workspace_id});
		} catch (error) {
			throw new Error(error.message || 'Save request failed');
		}
	}

}