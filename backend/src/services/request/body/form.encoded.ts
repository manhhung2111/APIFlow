import {RequestBody} from "@services/request";
import {HTMLInput} from "@ap/core";

export default class RequestFormEncoded extends RequestBody{
	protected type = RequestBody.FormEncoded;

	readData(): void{
		let data = Buffer.from(HTMLInput.inputRaw("body_data"), 'base64').toString('utf8');
		let body_data = JSON.parse(data);

		let form_encoded = [];
		for (let index = 0; index < body_data.form_encoded.length - 1; index++) {
			const selected = body_data.form_encoded[index].selected;
			const key = body_data.form_encoded[index].key;
			const value = body_data.form_encoded[index].value;
			const content = body_data.form_encoded[index].content;

			form_encoded.push({selected, key, value, content});
		}

		this.data = form_encoded;
	}
}