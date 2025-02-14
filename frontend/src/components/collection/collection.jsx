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
			{ key: `actions_edit_collection_${collection.id}`, label: "Edit", icon: <EditOutlined />, onClick: (event) => CollectionForm.edit(collection, event) },
			{ key: `actions_delete_collection_${collection.id}`, label: "Delete", icon: <DeleteOutlined />, onClick: (event) => CollectionForm.delete(collection, event), danger: 1 },
		];
	}
}
