import {Navigate, Outlet,} from "react-router";
import {useContext} from "react";
import {AppContext} from "@contexts/app.jsx";

export default function PublicRoute({redirectPath, children}){
	const {user, setUser} = useContext(AppContext);

	if(user || localStorage.getItem("user")){
		// Redirect to login and preserve the original path
		return <Navigate to={redirectPath} replace/>;
	}

	return children ? children : <Outlet/>;
}