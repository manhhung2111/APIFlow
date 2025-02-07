import {createContext, useContext, useEffect, useState} from "react";
import {collections, examples, folders, requests, environments} from "../data.js";
import {ConfigProvider} from "antd";
import UserService from "@services/user.js";

export const AppContext = createContext({});

export default function AppContextProvider(props){
	const {children} = props;

	const menuItems = {collections, folders, requests, examples};

	const [user, setUser] = useState(null);

	return (
		<ConfigProvider
			theme={{
				token: {
					fontFamily: "Inter"
				}
			}}
		>
			<AppContext.Provider value={{menuItems, environments, user, setUser}}>
				{children}
			</AppContext.Provider>
		</ConfigProvider>
	);
}