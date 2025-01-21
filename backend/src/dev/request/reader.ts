import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DRequest} from "@db-schemas";
import {DBRequest} from "@dev/request";
import Client from "@dev/client";
import UUID from "@utils/uuid";
import {RequestServiceReader} from "@services/request";
import {Code, HTMLInput, Validation} from "@ap/core";

export default class Reader extends DBReader<DRequest>{
	constructor(obj: HydratedDocument<DRequest> | null | undefined){
		super(obj);
	}

	public async read(){
		if (this.isCreating()){
			this._obj.user_id = Client.viewer._id.toString();
			this._obj.token = UUID.randomTokenSize32();
			this._obj.workspace_id = HTMLInput.param("workspace_id");
		}

		const request_reader = new RequestServiceReader();
		request_reader.readMethod()
			.readURL()
			.readParams()
			.readAuthorization()
			.readHeaders()
			.readBody()
			.readScripts();

		this._obj.method = request_reader.getMethod();
		this._obj.url = request_reader.getURL();
		this._obj.params = request_reader.getParams();
		this._obj.authorization = request_reader.getAuthorization();
		this._obj.headers = request_reader.getHeaders();
		this._obj.body = request_reader.getBody();
		this._obj.scripts = request_reader.getScripts();
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
}
