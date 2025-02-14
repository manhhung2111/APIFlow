import {createContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import WorkspaceService from "@services/workspace.js";
import CollectionService from "@services/collection.js";

export const WorkspaceContext = createContext({});

export default function WorkspaceContextProvider(props){
	const {children} = props;
	const {workspace_id} = useParams();

	const [workspace, setWorkspace] = useState(null);
	const [collections, setCollections] = useState(null);
	const [folders, setFolders] = useState([]);
	const [requests, setRequests] = useState([{collection_id: '67ad79dc244f93d96d34792c', name: "Request 1", method: "GET", examples: []}]);
	const [environments, setEnvironments] = useState([]);

	useEffect(() => {
		const getWorkspace = async () => {
			const response = await WorkspaceService.getById(workspace_id);

			if (response.code === 0){
				const workspace = response.data.workspace;
				setWorkspace(workspace);

				// Get all collections
				const collectionRes = await CollectionService.mine(workspace_id);
				setCollections(collectionRes.data.collections);

			} else {
				alert(response.message);
			}
		}

		getWorkspace();
	}, [workspace_id]);


	return (
		<WorkspaceContext.Provider value={{
			workspace,
			setWorkspace,
			collections,
			setCollections,
			folders,
			setFolders,
			requests,
			setRequests,
			environments,
			setEnvironments
		}}>
			{children}
		</WorkspaceContext.Provider>
	);
}