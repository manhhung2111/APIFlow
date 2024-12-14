import {RequestBody} from "@services/request";
import {HTMLInput} from "@ap/core";

export default class RequestFormData extends RequestBody{
	protected type = RequestBody.FormData;
	private prefix_field = "request_body_data";
	readData(): void{
		const data = [];

		for (let index = 0; index < this.MAX_ROWS; index++){
			const selected = HTMLInput.inputInline(`${this.prefix_field}_selected_${index}`) == "on";
			const key = HTMLInput.inputInline(`${this.prefix_field}_key_${index}`);
			const type = HTMLInput.inputInline(`${this.prefix_field}_type_${index}`);
			const description = HTMLInput.inputInline(`${this.prefix_field}_description_${index}`);

			let value: any;
			if (type === "text"){
				value = HTMLInput.inputInline(`${this.prefix_field}_value_${index}`);
			} else if (type == "files"){
				value = HTMLInput.inputFile(`${this.prefix_field}_value_${index}`);
			}
			if (!selected && !key && !value) continue;
			data.push({"selected": selected, "key": key, "value": value, "description": description});
		}
		this.data = {...data};
	}

}