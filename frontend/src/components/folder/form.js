export default class FolderForm {

	static create(){

	}

	static edit(folder, event){
		event.domEvent.stopPropagation();
		alert("edit folder");
		console.log(event)
	}

	static delete(folder, event){
		event.domEvent.stopPropagation();

		alert("delete folder");
	}
}