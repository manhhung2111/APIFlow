import {createContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import WorkspaceService from "@services/workspace.js";
import CollectionService from "@services/collection.js";
import FolderService from "@services/folder.js";
import RequestService from "@services/request.jsx";

export const WorkspaceContext = createContext({});

export default function WorkspaceContextProvider(props){
	const {children} = props;
	const {workspace_id} = useParams();

	const [workspace, setWorkspace] = useState(null);
	const [collections, setCollections] = useState(null);
	const [folders, setFolders] = useState(null);
	const [requests, setRequests] = useState(null);
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

				const folderRes = await FolderService.mine(workspace_id);
				setFolders(folderRes.data.folders);

				const requestRes = await RequestService.mine(workspace_id);
				setRequests(requestRes.data.requests);
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