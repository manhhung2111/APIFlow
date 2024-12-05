import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DWorkspace} from "@db-schemas";
import {Code, HTMLInput, Validation} from "@ap/core";
import Client from "@dev/client";
import UUID from "@utils/uuid";

export default class Reader extends DBReader<DWorkspace>{
	constructor(obj: HydratedDocument<DWorkspace> | null | undefined){
		super(obj);
	}

	public async read(){
		if (this.isCreating()){
			this._obj.user_id = Client.viewer._id;
			this._obj.token = UUID.randomTokenSize32();
		}

		await this.readPrimary();
	}

	public async readPrimary(){
		const name = HTMLInput.inputInline("name");
		const content = HTMLInput.inputInlineNoLimit("content");

		if (Validation.isEmpty(name)){
			throw new Code("Workspace name must not be empty");
		}

		this._obj.name = name;
		this._obj.content = content;
	}

	public async readName(){

	}

	public async readContent(){

	}
}
