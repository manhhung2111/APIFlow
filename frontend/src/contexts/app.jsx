import {createContext, useEffect, useState} from "react";
import {ConfigProvider} from "antd";
import UserService from "@services/user.js";
import PageLoader from "@components/app/utils/page.loader.jsx";
import {useNavigate} from "react-router";


export const AppContext = createContext({});

export default function AppContextProvider(props){
	const {children} = props;

	const [user, setUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [workspaces, setWorkspaces] = useState([]);
	const [fetching, setFetching] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function verifyUser(){
			try {
				setFetching(true);
				const response = await UserService.verify(); // Replace with your API URL

				if(response.code === 0){
					setUser(response.data.user);
					setUsers(response.data.users);
					setWorkspaces(response.data.workspaces);
					localStorage.setItem("user", JSON.stringify(response.data.user));
				} else {
					setUser(null);
					localStorage.removeItem("user");
				}
			} catch (err) {
				console.error("Error verifying user", err);
				setUser(null); // Prevent undefined state
			} finally {
				setFetching(false);
			}
		}

		setTimeout(async () => {
			if(localStorage.getItem("user")){
				if(!user){
					await verifyUser();
				}
			}

			setFetching(false);
		}, 0)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// if(fetching){
	// 	return <PageLoader/>;
	// }

	return (
		<ConfigProvider
			theme={{
				token: {
					fontFamily: "Inter"
				}
			}}
		>
			<AppContext.Provider value={{user, setUser, workspaces, setWorkspaces, users, setUsers, fetching}}>
				{children}
			</AppContext.Provider>
		</ConfigProvider>
	);
}