import {Navigate, Outlet} from "react-router";
import {useContext} from "react";
import {AppContext} from "@contexts/app.jsx";

export default function ProtectedRoute({redirectPath = "/", children}){
	const {user} = useContext(AppContext);

	if(!user && !localStorage.getItem("user")){
		return <Navigate to={redirectPath} replace/>;
	}

	return children ? children : <Outlet/>;
}