import CollectionForm from "@components/collection/form.js";
import './styles/menu.scss'
import { useNavigate } from "react-router";

export default class Collection{
	static AUTHORIZATION = {
		NoAuth: {value: 1, label: "No Auth"},
		BasicAuth: {value: 2, label: "Basic Auth"},
		BearerToken: {value: 3, label: "Bearer Token"},
		JWTBearer: {value: 4, label: "JWT Bearer"}
	};

	static am(collection, navigate){
		return [
			{
				key: `add_request_${collection.id}`,
				label: "Add request",
				onClick: () => CollectionForm.addRequest(collection)
			},
			{
				key: `add_folder_${collection.id}`,
				label: "Add folder",
				onClick: () => CollectionForm.addFolder(collection)
			},
			{
				key: `duplicate_${collection.id}`,
				label: "Duplicate",
			},
			{
				key: `export_${collection.id}`,
				label: "Export",
			},
			{
				key: `actions_delete_collection_${collection.id}`,
				label: "Delete",
				onClick: () => CollectionForm.delete(collection, navigate),
				danger: 1
			},
		];
	}
}
