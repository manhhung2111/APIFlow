import {createContext} from "react";
import {collections, examples, folders, requests, environments} from "../data.js";

export const AppContext = createContext({});

export default function AppContextProvider(props){
	const {children} = props;

	const menuItems = {collections, folders, requests, examples};

	return (
		<AppContext.Provider value={{menuItems, environments}}>
			{children}
		</AppContext.Provider>
	);
}