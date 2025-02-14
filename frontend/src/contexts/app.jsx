import {createContext, useEffect, useState} from "react";
import {collections, environments, examples, folders, requests} from "../data.js";
import {ConfigProvider} from "antd";
import UserService from "@services/user.js";
import WorkspaceService from "@services/workspace.js";
import {toast} from "react-toastify";
import PageLoader from "@components/app/utils/loader.jsx";
import {useNavigate} from "react-router";

export const AppContext = createContext({});

export default function AppContextProvider(props){
	const {children} = props;

	const menuItems = {collections, folders, requests, examples};

	const [user, setUser] = useState(null);
	const [workspaces, setWorkspaces] = useState([]);
	const [fetching, setFetching] = useState(true);
	const navigate = useNavigate();


	useEffect(() => {
		async function verifyUser(){
			try {
				const response = await UserService.verify(); // Replace with your API URL

				if(response.code === 0){
					setUser(response.data.user);
					localStorage.setItem("user", JSON.stringify(response.data.user));

					const workspaceResponse = await WorkspaceService.mine();

					if(workspaceResponse.code === 0){
						setWorkspaces([...workspaceResponse.data.workspaces]);
					} else {
						toast.error(workspaceResponse.message);
					}

				} else {
					setUser(null);
					localStorage.removeItem("user");
					navigate('/login');
				}
			} catch (err) {
				console.error("Error verifying user", err);
				setUser(null); // Prevent undefined state
				localStorage.removeItem("user");
				navigate('/login');
			} finally {
				setFetching(false);
			}
		};

		if(localStorage.getItem("user")){
			if (!user) {
				verifyUser();
			}
		} else {
			setFetching(false);
			navigate('/login', {replace: true});
		}

		console.log(user);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	if(fetching){
		return <PageLoader/>;
	}

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