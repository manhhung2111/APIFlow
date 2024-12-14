import {RequestBody} from "@services/request";
import {HTMLInput} from "@ap/core";

export default class RequestFormEncoded extends RequestBody{
	protected type = RequestBody.FormEncoded;
	private prefix_field = "request_body_encoded";
	readData(): void{
		const data = [];

		for (let index = 0; index < this.MAX_ROWS; index++){
			const selected = HTMLInput.inputInline(`${this.prefix_field}_selected_${index}`) == "on";
			const key = HTMLInput.inputInline(`${this.prefix_field}_key_${index}`);
			const value = HTMLInput.inputInline(`${this.prefix_field}_value_${index}`);
			const description = HTMLInput.inputInline(`${this.prefix_field}_description_${index}`);

			if (!selected && !key && !value) continue;
			data.push({"selected": selected, "key": key, "value": value, "description": description});
		}
		this.data = {...data}
	}

}