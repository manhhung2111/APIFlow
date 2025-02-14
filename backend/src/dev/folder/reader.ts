import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DFolder} from "@db-schemas";
import {DBFolder} from "@dev/folder/index";
import Client from "@dev/client";
import UUID from "@utils/uuid";
import {Code, HTMLInput, Validation} from "@ap/core";


export default class Reader extends DBReader<DFolder>{
	constructor(obj: HydratedDocument<DFolder> | null | undefined){
		super(obj);
	}

	public async read(){
		if (this.isCreating()){
			this._obj.user_id = Client.viewer._id.toString();
			this._obj.token = UUID.randomTokenSize32();
			this._obj.workspace_id = HTMLInput.inputInline("workspace_id");
			this._obj.collection_id = HTMLInput.inputInline("collection_id");
			this._obj.name = "New Folder";
		} else {
			await this.readName();
			await this.readContent();
		}
	}


	public async duplicate(old_folder: DBFolder){

	}


	public async readName(){
		const name = HTMLInput.inputInline("name");
		if (Validation.isEmpty(name)){
			throw new Code("Folder name must not be empty");
		}

		if (name.length > 255){
			throw new Code("Folder name must not exceed 255 characters");
		}

		this._obj.name = name;
	}


	public async readContent(){
		this._obj.content = HTMLInput.inputEditor("content");
	}
}
