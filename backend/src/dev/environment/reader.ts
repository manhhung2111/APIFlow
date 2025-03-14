import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DEnvironment} from "@db-schemas";
import Client from "@dev/client";
import UUID from "@utils/uuid";
import {Code, HTMLInput, Validation} from "@ap/core";
import {DBEnvironment} from "@dev/environment/index";


export default class Reader extends DBReader<DEnvironment>{
	constructor(obj: HydratedDocument<DEnvironment> | null | undefined){
		super(obj);
	}

	public async read(){
		if (this.isCreating()){
			this._obj.user_id = Client.viewer._id.toString();
			this._obj.token = UUID.randomTokenSize32();
			this._obj.workspace_id = HTMLInput.inputInline("workspace_id");
			this._obj.name = "New Environment";
			this._obj.variables = [];
			this._obj.scope = 1;
		} else {
			this.readName();
			this.readVariables();
		}
	}


	public async readGlobal(workspace_id: string) {
		this._obj.user_id = Client.viewer._id.toString();
		this._obj.token = UUID.randomTokenSize32();
		this._obj.workspace_id = workspace_id;

		this._obj.name = "Globals";
		this._obj.variables = [];
	}


	public readName(){
		this._obj.name = HTMLInput.inputInline("name");

		if (Validation.isEmpty(this._obj.name)){
			throw new Code("Environment name must not be empty");
		}

		if (this._obj.name.length > 255){
			throw new Code("Environment name must not exceed 255 characters");
		}
	}


	public readVariables() {
		let data = Buffer.from(HTMLInput.inputRaw("variables"), 'base64').toString('utf8');
		let variables = JSON.parse(data);

		let new_variables = [];

		for (let index = 0; index < variables.length; index++) {
			const selected = variables[index].selected;
			const variable = variables[index].variable;
			const type = variables[index].type;
			const initial_value = variables[index].initial_value;
			const current_value = variables[index].current_value;

			if (!selected && !variable && !initial_value && !current_value) break;
			new_variables.push({selected, variable, type, initial_value, current_value});
		}

		this._obj.variables = new_variables;
	}


	public duplicate(old_environment: DBEnvironment) {

	}
}
