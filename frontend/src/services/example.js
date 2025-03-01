import axios from "@configs/axios.js";

export default class ExampleService {
	static async createFromResponse(request, method, url, params, headers, body, response) {
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
			formData.append("collection_id", request.collection_id);
			formData.append("folder_id", request.folder_id ?? "");
			formData.append("request_id", request._id);

			// Add files if exists
			body.data.form_data.forEach((row, index) => {
				if (row.type === "file") {
					if (row.value && Object.keys(row.value)) {
						formData.append(`form_data_value_${index}`, row.value);
					}
				}
			});

			formData.append("response", btoa(JSON.stringify(response)));

			return await axios.post(`/examples/response`, formData);
		} catch (error) {
			throw new Error(error.message || 'Save request failed');
		}
	}

	static async createFromRequest(request) {
		try {
			return await axios.post(`/examples/request`, {request_id: request._id, workspace_id: request.workspace_id});
		} catch (error) {
			throw new Error(error.message || 'Save request failed');
		}
	}
}