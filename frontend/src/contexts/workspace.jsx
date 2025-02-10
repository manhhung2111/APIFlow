import {createContext, useContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import WorkspaceService from "@services/workspace.js";
import {setTwoToneColor} from "@ant-design/icons";

export const WorkspaceContext = createContext({});

export default function WorkspaceContextProvider(props){
	const {children} = props;
	const {workspace_id} = useParams();

	const [workspace, setWorkspace] = useState(null);

	useEffect(() => {
		const getWorkspace = async () => {
			const response = await WorkspaceService.getById(workspace_id);

			console.log(response);
			if (response.code === 0){
				setWorkspace(response.data.workspace);
			} else {
				alert(response.message);
			}
		}

		getWorkspace();
	}, [workspace_id]);


	return (
		<WorkspaceContext.Provider value={{workspace, setWorkspace}}>
			{children}
		</WorkspaceContext.Provider>
	);
}