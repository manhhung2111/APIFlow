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
			this._obj.user_id = Client.viewer._id.toString();
			this._obj.token = UUID.randomTokenSize32();
		}

		await this.readName();
		await this.readContent();
		await this.readUsers();
	}

	public async readName(){
		const name = HTMLInput.inputInline("name");
		if (Validation.isEmpty(name)){
			throw new Code("Workspace name must not be empty");
		}

		if (name.length > 255){
			throw new Code("Workspace name too long, exceeds 255 characters");
		}

		this._obj.name = name;
	}

	public async readContent(){
		this._obj.content = HTMLInput.inputSafe("content");
	}


	public async readUsers() {
		this._obj.viewers = HTMLInput.inputList("viewers");
		this._obj.commenters = HTMLInput.inputList("commenters");
		this._obj.editors = HTMLInput.inputList("editors");
	}
}
