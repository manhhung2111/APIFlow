import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DEnvironment} from "@db-schemas";
import Client from "@dev/client";
import UUID from "@utils/uuid";
import {Code, HTMLInput, Validation} from "@ap/core";


export default class Reader extends DBReader<DEnvironment>{
	constructor(obj: HydratedDocument<DEnvironment> | null | undefined){
		super(obj);
	}

	public read(){
		if (this.isCreating()){
			this._obj.user_id = Client.viewer._id.toString();
			this._obj.token = UUID.randomTokenSize32();
			this._obj.workspace_id = HTMLInput.param("workspace_id");
		}

		this.readName();
		this.readVariables();
	}


	public readName(){
		this._obj.name = HTMLInput.inputInline("name");

		if (Validation.isEmpty(this._obj.name)){
			throw new Code("Request this._obj.name must not be empty");
		}

		if (this._obj.name.length > 255){
			throw new Code("Request name must not exceed 255 characters");
		}
	}


	public readVariables() {
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
}
