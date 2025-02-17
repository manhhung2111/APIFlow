import '@components/request/styles/index.scss'
import "./index.scss";
import "quill/dist/quill.snow.css";
import 'quill/dist/quill.bubble.css'
import RequestContextProvider from "@contexts/request.jsx";
import {Route, Routes} from "react-router";
import ProtectedRoute from "@layout/routes/protected.jsx";
import LoginPage from "@pages/authentication/login.jsx";
import RegisterPage from "@pages/authentication/register.jsx";
import ForbiddenPage from "@pages/error/forbidden.jsx";
import NotFoundPage from "@pages/error/not.found.jsx";
import WorkspacePage from "@pages/workspace/workspace.jsx";
import RequestPage from "@pages/request/request.jsx";
import AppContextProvider from "@contexts/app.jsx";
import WorkspaceDisplay from "@components/workspace/display/display.jsx";
import HomePage from "@pages/home/home.jsx";
import PublicRoute from "@layout/routes/public.jsx";
import CollectionPage from "@pages/collection/collection.jsx";
import FolderPage from "@pages/folder/folder.jsx";

function App(){
	return (
		<AppContextProvider>
			<RequestContextProvider>
				<Routes>
					<Route path="/" element={<ProtectedRoute redirectPath={"/login"}/>}>
						<Route index element={<HomePage/>}/>
						<Route path="workspace/:workspace_id/" element={<WorkspacePage/>}>
							<Route index element={<WorkspaceDisplay/>}/>
							<Route path="request/:request_id/" element={<RequestPage/>}/>
							<Route path="collection/:collection_id" element={<CollectionPage/>}/>
							<Route path="folder/:folder_id" element={<FolderPage/>}/>
						</Route>
					</Route>

					<Route path="login" element={<PublicRoute redirectPath={"/"}><LoginPage/></PublicRoute>}/>
					<Route path="register" element={<PublicRoute redirectPath={"/"}><RegisterPage/></PublicRoute>}/>

					<Route path="forbidden" element={<ForbiddenPage/>}/>
					<Route path="*" element={<NotFoundPage/>}/>
				</Routes>
			</RequestContextProvider>
		</AppContextProvider>
	);
}

export default App;
