import {createContext, useContext, useState} from "react";
import {useParams} from "react-router";

export const WorkspaceContext = createContext({});

export default function WorkspaceContextProvider(props){
	const {children} = props;
	const {workspace_id} = useParams();

	const {workspace, setWorkspace} = useState(null);



	return (
		<WorkspaceContext.Provider value={{}}>
			{children}
		</WorkspaceContext.Provider>
	);
}