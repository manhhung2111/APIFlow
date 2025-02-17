import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DFolder} from "@db-schemas";
import {DBFolder} from "@dev/folder/index";
import Client from "@dev/client";
import UUID from "@utils/uuid";
import {Code, HTMLInput, Validation} from "@ap/core";
import {RequestServiceReader} from "@services/request";


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
			return;
		}

		this.readName();
		this.readContent();
		this.readAuthentication();
		this.readScripts();
	}


	public async duplicate(old_folder: DBFolder){

	}


	public readName(){
		const name = HTMLInput.inputInline("name");
		if (Validation.isEmpty(name)){
			throw new Code("Folder name must not be empty");
		}

		if (name.length > 255){
			throw new Code("Folder name must not exceed 255 characters");
		}

		this._obj.name = name;
	}


	public readContent(){
		this._obj.content = HTMLInput.inputEditor("content");
	}

	public readAuthentication() {
		const request_reader = new RequestServiceReader();
		request_reader.readAuthorization();
		this._obj.authorization = request_reader.getAuthorization();
	}

	public readScripts() {
		let data = Buffer.from(HTMLInput.inputRaw("scripts"), 'base64').toString('utf8');
		this._obj.scripts = JSON.parse(data);
	}
}
