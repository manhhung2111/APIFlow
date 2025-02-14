import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import CollectionForm from "@components/collection/form.js";
import './styles/menu.scss'

export default class Collection {
	static AUTHORIZATION = {
		NoAuth: {value: 1, label: "No Auth"},
		BasicAuth: {value: 2, label: "Basic Auth"},
		BearerToken: {value: 3, label: "Bearer Token"},
		JWTBearer: {value: 4, label: "JWT Bearer"}
	};

	static am(collection) {
		return [
			{ key: `edit_${collection.id}`, label: "Edit", onClick: (event) => CollectionForm.edit(collection, event) },
			{ key: `add_request_${collection.id}`, label: "Add request", onClick: (event) => CollectionForm.addRequest(collection) },
			{ key: `add_folder_${collection.id}`, label: "Add folder", onClick: (event) => CollectionForm.addFolder(collection) },
			{ key: `duplicate_${collection.id}`, label: "Duplicate", onClick: (event) => CollectionForm.edit(collection, event) },
			{ key: `export_${collection.id}`, label: "Export", onClick: (event) => CollectionForm.edit(collection, event) },
			{ key: `actions_delete_collection_${collection.id}`, label: "Delete", onClick: (event) => CollectionForm.delete(collection, event), danger: 1 },
		];
	}
}
