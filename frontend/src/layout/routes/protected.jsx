import {Navigate, Outlet, useNavigate} from "react-router";
import {useContext, useEffect} from "react";
import {AppContext} from "@contexts/app.jsx";
import UserService from "@services/user.js";

export default function ProtectedRoute({redirectPath = "/", children}){
	const {user, setUser} = useContext(AppContext);
	const navigate = useNavigate();

	useEffect(() => {
		const verifyUser = async () => {
			try {
				const response = await UserService.verify(); // Replace with your API URL

				if (response.code === 0) {
					setUser(response.data.user);
					localStorage.setItem("authenticated", "true");
				} else {
					setUser(null);
					localStorage.removeItem("authenticated");
					alert("401 Unauthenticated");
					window.redirect("/login");
					navigate(redirectPath);
				}
			} catch (err) {
				console.error("Error verifying user", err);
				setUser(null); // Prevent undefined state
				localStorage.removeItem("authenticated");
			}
		};

		const authenticated = localStorage.getItem("authenticated");
		if (authenticated && !user) {
			verifyUser();
		}
	}, []);

	return children ? children : <Outlet/>;
}