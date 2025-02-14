export default class CollectionForm{

	static create(){

	}

	static edit(collection, event){
		event.domEvent.stopPropagation();
		alert("edit collection");
		console.log(event)
	}

	static delete(collection, event){
		event.domEvent.stopPropagation();

		alert("delete collection");
	}
}