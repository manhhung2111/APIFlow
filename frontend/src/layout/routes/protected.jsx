import {Navigate, Outlet} from "react-router";
import {useContext} from "react";
import {AppContext} from "@contexts/app.jsx";
import PageLoader from "@components/app/utils/page.loader.jsx";

export default function ProtectedRoute({redirectPath = "/", children}){
	const {user, fetching} = useContext(AppContext);

	if (fetching){
		return <PageLoader />
	}

	if(!user && !localStorage.getItem("user")){
		return <Navigate to={redirectPath} replace/>;
	}

	return children ? children : <Outlet/>;
}