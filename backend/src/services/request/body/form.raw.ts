import {RequestBody} from "@services/request";
import {Code, HTMLInput} from "@ap/core";

export default class RequestFormRaw extends RequestBody{
	protected type = RequestBody.FormRaw;

	readData(): void{
		let data = Buffer.from(HTMLInput.inputRaw("body_data"), 'base64').toString('utf8');
		let body_data = JSON.parse(data);

		try {
			this.data = JSON.parse(body_data.form_raw);
		} catch (error) {
			throw new Code("Invalid raw body");
		}

	}

}