import {RequestBody} from "@services/request";
import {HTMLInput} from "@ap/core";
import BackblazeService from "@services/backblaze";

export default class RequestFormData extends RequestBody{
	protected type = RequestBody.FormData;

	readData(): void{
		let data = Buffer.from(HTMLInput.inputRaw("body_data"), 'base64').toString('utf8');
		let body_data = JSON.parse(data);

		// Read form data
		let form_data = [];
		for (let index = 0; index < body_data.form_data.length - 1; index++) {
			const selected = body_data.form_data[index].selected;
			const key = body_data.form_data[index].key;
			const type = body_data.form_data[index].type;

			let value = body_data.form_data[index].value;
			if (type == "file") {
				const files = HTMLInput.inputFile(`form_data_value_${index}`);

				if (files && files.length > 0) {
					value = files[files.length - 1];
				}
			}
			const content = body_data.form_data[index].content;

			form_data.push({selected, key, type, value, content});
		}

		this.data = form_data;
	}

}