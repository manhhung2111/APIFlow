import FolderService from "@services/folder.js";
import {toast} from "react-toastify";
import CollectionService from "@services/collection.js";

export default class CollectionForm{

	static create(){

	}

	static edit(collection, event){
		event.domEvent.stopPropagation();
		alert("edit collection");
		console.log(event)
	}


	static async addRequest(collection) {
		const result = await CollectionService.addRequest(collection);

		if (result.code === 0) {
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	static async addFolder(collection) {
		const result = await FolderService.create(collection);

		if (result.code === 0) {
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}


	static async delete(collection, navigate){
		const result = await CollectionService.delete(collection);

		if (result.code === 0) {
			toast.success(result.message);
			navigate(`/workspace/${collection.workspace_id}`);
		} else {
			toast.error(result.message);
		}
	}
}