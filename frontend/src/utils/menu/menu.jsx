import CollectionIcon from "@assets/icons/collection.jsx";
import {ApiOutlined, FolderOutlined, PaperClipOutlined} from "@ant-design/icons";
import {NavLink} from "react-router";
import MasterMenuItem from "@utils/menu/item.jsx";
import Collection from "@components/collection/collection.jsx";
import EnvironmentIcon from "@assets/icons/environment.jsx";

export default class Menu{

	static constructPrimaryMenu(collections, folders, requests, examples){
		return collections.map(collection => {
			const assocFolders = folders.filter(folder => folder.collection_id === collection.id);
			const assocRequestsFolders = requests.filter(request => request.collection_id === collection.id && request.folder_id !== null);
			const assocRequests = requests.filter(request => request.collection_id === collection.id && request.folder_id == null)
			const assocExamples = examples.filter(example => example.collection_id === collection.id);

			const folders_children = this.#renderFolders(assocFolders, assocRequestsFolders, assocExamples);
			const requests_children = this.#renderRequests(assocRequests, assocExamples)
			const children = [...folders_children, ...requests_children];
			return {
				key: `menu_collection_${collection.id}`,
				icon: <CollectionIcon style={{fontSize: "14px"}}/>,
				label: <MasterMenuItem url={`collections/${collection.id}`} title={collection.name} am={Collection.am(collection)}/>,
				...(children.length ? {children: children} : {})
			}
		});
	}

	static constructEnvironmentMenu(environments){
		let globalItems = [];
		let environmentItems = [];

		environments.forEach(environment => {
			if (environment.scope === 1) {
				return environmentItems.push({
					key: `environment_${environment.id}`,
					label: <MasterMenuItem url={`environments/${environment.id}`} title={environment.name}/>,
					icon: <EnvironmentIcon style={{fontSize: "14px"}}/>
				});
			}
			return globalItems.push({
				key: `global_environment_${environment.id}`,
				label: <MasterMenuItem url={`environments/globals`} title={environment.name}/>,
				icon: <EnvironmentIcon style={{fontSize: "14px"}}/>
			});
		});

		return [globalItems, environmentItems];
	}

	static #renderFolders(folders, requests, examples){
		return folders.map(folder => {
			const assoc_requests = requests.filter(request => request.folder_id === folder.id);
			const assoc_examples = examples.filter(example => example.folder_id === folder.id);

			const children = this.#renderRequests(assoc_requests, assoc_examples);
			return {
				key: `menu_folder_${folder.id}`,
				icon: <FolderOutlined/>,
				label: <NavLink to={`folders/${folder.id}`}>{folder.name}</NavLink>,
				...(children.length ? {children: children} : {})
			}
		});
	}

	static #renderRequests(requests, examples){
		return requests.map(request => {
			const assoc_examples = examples.filter(example => example.request_id === request.id);

			const children = this.#renderExamples(assoc_examples);
			return {
				key: `menu_request_${request.id}`,
				icon: <ApiOutlined/>,
				label: <NavLink to={`requests/${request.id}`}>{request.name}</NavLink>,
				...(children.length ? {children: children} : {})
			}
		});
	}

	static #renderExamples(examples){
		return examples.map(example => {
			return {
				key: `menu_example_${example.id}`,
				icon: <PaperClipOutlined/>,
				label: <NavLink to={`examples/${example.id}`}>{example.name}</NavLink>,
			}
		});
	}
}