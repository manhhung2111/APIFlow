import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import FolderForm from "@components/folder/form.js";

export default class Folder {
	static am(folder) {
		return [
			{ key: `edit_${folder.id}`, label: "Edit", icon: <EditOutlined />, onClick: (event) => FolderForm.edit(folder, event) },
			{ key: `delete_${folder.id}`, label: "Delete", icon: <DeleteOutlined />, onClick: (event) => FolderForm.delete(folder, event), danger: 1 },
		];
	}
}