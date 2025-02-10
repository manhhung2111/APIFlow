import {createContext, useContext, useEffect, useState} from "react";
import {collections, examples, folders, requests, environments} from "../data.js";
import {ConfigProvider} from "antd";
import UserService from "@services/user.js";
import WorkspaceService from "@services/workspace.js";
import {toast} from "react-toastify";

export const AppContext = createContext({});

export default function AppContextProvider(props){
	const {children} = props;

	const menuItems = {collections, folders, requests, examples};

	const [user, setUser] = useState(null);
	const [workspaces, setWorkspaces] = useState([]);
	useEffect(() => {
		async function fetchData(){
			// Fetch user workspaces
			const response = await WorkspaceService.mine();

			if (response.code === 0) {
				setWorkspaces([...response.data.workspaces]);
			} else {
				toast.error(response.message);
			}
		}

		fetchData();
	}, []);


	return (
		<ConfigProvider
			theme={{
				token: {
					fontFamily: "Inter"
				}
			}}
		>
			<AppContext.Provider value={{menuItems, environments, user, setUser, workspaces, setWorkspaces}}>
				{children}
			</AppContext.Provider>
		</ConfigProvider>
	);
}