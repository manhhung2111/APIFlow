import {Navigate, Outlet,} from "react-router";
import {useContext} from "react";
import {AppContext} from "@contexts/app.jsx";
import PageLoader from "@components/app/utils/page.loader.jsx";

export default function PublicRoute({redirectPath, children}){
	const {user, fetching} = useContext(AppContext);

	console.log("Is app initialized", fetching);
	if (fetching){
		return <PageLoader />;
	}

	console.log(user)

	if(user || localStorage.getItem("user")){
		// Redirect to login and preserve the original path
		return <Navigate to={redirectPath} replace/>;
	}

	return children ? children : <Outlet/>;
}