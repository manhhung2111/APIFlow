import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DCollection} from "@db-schemas";
import Client from "@dev/client";
import UUID from "@utils/uuid";
import {Code, HTMLInput, Validation} from "@ap/core";
import {RequestServiceReader} from "@services/request";


export default class Reader extends DBReader<DCollection>{
	constructor(obj: HydratedDocument<DCollection> | null | undefined){
		super(obj);
	}

	public read(){
		if (this.isCreating()){
			this._obj.user_id = Client.viewer._id.toString();
			this._obj.token = UUID.randomTokenSize32();
			this._obj.workspace_id = HTMLInput.param("workspace_id");
		}

		this.readName();
		this.readContent();
		this.readAuthentication();
		this.readVariables();
		this.readScripts();
	}

	public duplicate(){

	}

	public readContent(){
		this._obj.content = HTMLInput.inputEditor("content");
	}

	public readName(){
		const name = HTMLInput.inputInline("name");
		if (Validation.isEmpty(name)){
			throw new Code("Request name must not be empty");
		}

		if (name.length > 255){
			throw new Code("Request name must not exceed 255 characters");
		}

		this._obj.name = name;
	}


	public readAuthentication(){
		const request_reader = new RequestServiceReader();
		request_reader.readAuthorization();
		this._obj.authorization = request_reader.getAuthorization();
	}


	public readVariables(){
		let data = Buffer.from(HTMLInput.inputRaw("variables"), 'base64').toString('utf8');
		let variables = JSON.parse(data);

		for (let index = 0; index < variables.length; index++){
			const selected = variables[index].selected;
			const variable = variables[index].variable;
			const type = variables[index].type || "text";
			const initial_value = variables[index].initial_value;
			const current_value = variables[index].current_value;

			this._obj.variables.push({selected, variable, type, initial_value, current_value});
		}
	}

	public readScripts() {

	}


}
