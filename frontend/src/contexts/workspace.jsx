import {createContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import WorkspaceService from "@services/workspace.js";

export const WorkspaceContext = createContext({});

export default function WorkspaceContextProvider(props){
	const {children} = props;
	const {workspace_id} = useParams();

	const [workspace, setWorkspace] = useState(null);
	const [activeEnvironment, setActiveEnvironment] = useState(null);
	const [activeCollection, setActiveCollection] = useState(null);

	const [collections, setCollections] = useState(null);
	const [folders, setFolders] = useState(null);
	const [requests, setRequests] = useState(null);
	const [environments, setEnvironments] = useState([]);

	const [activeMenuKey, setActiveMenuKey] = useState(1);

	useEffect(() => {
		const getWorkspace = async() => {
			const response = await WorkspaceService.getById(workspace_id);

			if(response.code === 0){
				const workspace = response.data.workspace;
				setWorkspace(workspace);
				setCollections(response.data.collections);
				setFolders(response.data.folders);
				setRequests(response.data.requests);
				setEnvironments(response.data.environments);
			} else {
				alert(response.message);
			}
		}

		setWorkspace(null);
		setActiveEnvironment(null);
		setActiveCollection(null);
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
			setEnvironments,
			activeMenuKey,
			setActiveMenuKey,
			activeEnvironment, setActiveEnvironment,
			activeCollection, setActiveCollection,
		}}>
			{children}
		</WorkspaceContext.Provider>
	);
}