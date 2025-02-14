import FolderForm from "@components/folder/form.js";

export default class Folder {
	static am(folder) {
		return [
			{key: `edit_${folder.id}`, label: "Edit", onClick: () => FolderForm.edit(folder)},
			{key: `add_request_${folder.id}`, label: "Add request", onClick: () => FolderForm.addRequest(folder)},
			{key: `duplicate_${folder.id}`, label: "Duplicate", onClick: (event) => FolderForm.edit(folder, event)},
			{key: `delete_${folder.id}`, label: "Delete", onClick: () => FolderForm.delete(folder), danger: 1},
		];
	}
}