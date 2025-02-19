import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DRequest} from "@db-schemas";
import {DBRequest} from "@dev/request";
import Client from "@dev/client";
import UUID from "@utils/uuid";
import {RequestServiceReader} from "@services/request";
import {Code, HTMLInput, Validation} from "@ap/core";
import BackblazeService from "@services/backblaze";

export default class Reader extends DBReader<DRequest>{
	constructor(obj: HydratedDocument<DRequest> | null | undefined){
		super(obj);
	}

	public async read(){
		if (this.isCreating()){
			this._obj.user_id = Client.viewer._id.toString();
			this._obj.token = UUID.randomTokenSize32();
			this._obj.workspace_id = HTMLInput.inputInline("workspace_id");
		}

		const request_reader = new RequestServiceReader();
		request_reader.readMethod()
			.readURL()
			.readParams()
			.readAuthorization()
			.readHeaders()
			.readScripts();

		this._obj.method = request_reader.getMethod();
		this._obj.url = request_reader.getURL();
		this._obj.params = request_reader.getParams();
		this._obj.authorization = request_reader.getAuthorization();
		this._obj.headers = request_reader.getHeaders();
		this._obj.scripts = request_reader.getScripts();

		await this.readBody();
	}


	public async readCollection() {
		this._obj.user_id = Client.viewer._id.toString();
		this._obj.token = UUID.randomTokenSize32();
		this._obj.workspace_id = HTMLInput.inputInline("workspace_id");
		this._obj.collection_id = HTMLInput.inputInline("collection_id");
		this._obj.name = "New request";
		this._obj.headers = [
			{selected: true, key: 'Accept', value: '*/*', content: ''},
			{selected: true, key: 'Accept-Encoding', value: 'gzip, deflate, br', content: ''},
			{selected: true, key: 'Connection', value: 'keep-alive', content: ''},
		]
	}

	public async readFolder() {
		this._obj.user_id = Client.viewer._id.toString();
		this._obj.token = UUID.randomTokenSize32();
		this._obj.workspace_id = HTMLInput.inputInline("workspace_id");
		this._obj.collection_id = HTMLInput.inputInline("collection_id");
		this._obj.folder_id = HTMLInput.inputInline("folder_id");
		this._obj.name = "New request";
		this._obj.headers = [
			{selected: true, key: 'Accept', value: '*/*', content: ''},
			{selected: true, key: 'Accept-Encoding', value: 'gzip, deflate, br', content: ''},
			{selected: true, key: 'Connection', value: 'keep-alive', content: ''},
		]
	}


	public async readName(){
		const name = HTMLInput.inputInline("name");
		if (Validation.isEmpty(name)){
			throw new Code("Request name must not be empty");
		}

		if (name.length > 255){
			throw new Code("Request name must not exceed 255 characters");
		}

		this._obj.name = name;
	}

	public async readContent(){
		this._obj.content = HTMLInput.inputEditor("content");
	}

	public async duplicate(old_request: DBRequest){

	}


	private async readBody() {
		this._obj.body.type = HTMLInput.inputInt("body_type");

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
				const file_export = await BackblazeService.uploadFile(files[files.length - 1]);
				value = file_export;
			}

			const content = body_data.form_data[index].content;

			form_data.push({selected, key, type, value, content});
		}

		// Read form encoded
		let form_encoded = [];
		for (let index = 0; index < body_data.form_encoded.length - 1; index++) {
			const selected = body_data.form_encoded[index].selected;
			const key = body_data.form_encoded[index].key;
			const value = body_data.form_encoded[index].value;
			const content = body_data.form_encoded[index].content;

			form_encoded.push({selected, key, value, content});
		}

		// Read form raw
		let form_raw = body_data.form_raw;

		this._obj.body.data = {
			form_data: form_data,
			form_encoded: form_encoded,
			form_raw: form_raw
		};
	}
}
