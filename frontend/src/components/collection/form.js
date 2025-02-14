import FolderService from "@services/folder.js";
import {toast} from "react-toastify";

export default class CollectionForm{

	static create(){

	}

	static edit(collection, event){
		event.domEvent.stopPropagation();
		alert("edit collection");
		console.log(event)
	}


	static addRequest(collection) {

	}

	static async addFolder(collection) {
		const result = await FolderService.create(collection);

		if (result.code === 0) {
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}


	static delete(collection, event){
		event.domEvent.stopPropagation();

		alert("delete collection");
	}
}