import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import CollectionForm from "@components/collection/form.jsx";

export default class Collection {
	static am(collection) {
		return [
			{ key: `actions_edit_collection_${collection.id}`, label: "Edit", icon: <EditOutlined />, onClick: (event) => CollectionForm.edit(collection, event) },
			{ key: `actions_delete_collection_${collection.id}`, label: "Delete", icon: <DeleteOutlined />, onClick: (event) => CollectionForm.delete(collection, event), danger: 1 },
		];
	}
}
