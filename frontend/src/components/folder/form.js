import {toast} from "react-toastify";
import FolderService from "@services/folder.js";

export default class FolderForm{

	static create(){

	}

	static async addRequest(folder){
		const result = await FolderService.addRequest(folder);

		if(result.code === 0){
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	static edit(folder){
		alert("edit folder");
	}

	static delete(folder){

		alert("delete folder");
	}
}