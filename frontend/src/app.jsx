import SuperHeader from "@layout/header/header.jsx";
import MasterMenu from "@layout/menu/menu.jsx";
import RequestDisplayHeader from "@components/request/display/header.jsx";
import RequestSidebar from "@components/request/sidebar/sidebar.jsx";
import '@components/request/styles/index.scss'
import "./index.scss";
import RequestEditorUrl from "@components/request/display/editor/url.jsx";
import RequestEditorUrlMain from "@components/request/display/editor/main.jsx";
import RequestContextProvider from "@contexts/request.jsx";
import RequestResponse from "@components/request/response/display/display.jsx";
import {BrowserRouter, Route, Routes} from "react-router";
import ProtectedRoute from "@layout/routes/protected.jsx";
import LoginPage from "@pages/authentication/login.jsx";
import RegisterPage from "@pages/authentication/register.jsx";
import ForbiddenPage from "@pages/error/forbidden.jsx";
import NotFoundPage from "@pages/error/not.found.jsx";
import WorkspacePage from "@pages/workspace/workspace.jsx";
import RequestPage from "@pages/request/request.jsx";
import {useContext, useEffect} from "react";
import {AppContext} from "@contexts/app.jsx";
import WorkspaceDisplay from "@components/workspace/display/display.jsx";
import HomePage from "@pages/home/home.jsx";
import PublicRoute from "@layout/routes/public.jsx";
import UserService from "@services/user.js";

function App() {
    const {user, setUser} = useContext(AppContext);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await UserService.verify(); // Replace with your API URL

                if (response.code === 0) {
                    setUser(response.data.user);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                } else {
                    setUser(null);
                    localStorage.removeItem("user");
                }
            } catch (err) {
                console.error("Error verifying user", err);
                setUser(null); // Prevent undefined state
                localStorage.removeItem("user");
            }
        };
        verifyUser();
    }, []);

    return (
        <RequestContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ProtectedRoute redirectPath={"/login"} />}>
                        <Route index element={<HomePage />}/>
                        <Route path="workspace/:workspace_id/" element={<WorkspacePage />}>
                            <Route index element={<WorkspaceDisplay />}/>
                            <Route path="request/:request_id/" element={<RequestPage />} />
                        </Route>
                    </Route>

                    <Route path="login" element={<PublicRoute redirectPath={"/"}><LoginPage/></PublicRoute>}/>
                    <Route path="register" element={<PublicRoute redirectPath={"/"}><RegisterPage/></PublicRoute>}/>

                    <Route path="forbidden" element={<ForbiddenPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </BrowserRouter>
        </RequestContextProvider>
    );
}

export default App;
