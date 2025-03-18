import '@components/request/styles/index.scss'
import "./index.scss";
import "quill/dist/quill.snow.css";
import 'quill/dist/quill.bubble.css'
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
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
import EnvironmentPage from "@pages/environment/environment.jsx";
import ExamplePage from "@pages/example/example.jsx";
import WorkspacesPage from "@pages/workspaces/workspaces.jsx";
import DocumentationPage from "@pages/documentation/documentation.jsx";

function App(){
	return (
		<AppContextProvider>
			<Routes>
				<Route path="/" element={<ProtectedRoute redirectPath={"/login"}/>}>
					<Route index element={<HomePage/>}/>
					<Route path="workspace/:workspace_id/" element={<WorkspacePage/>}>
						<Route index element={<WorkspaceDisplay/>}/>
						<Route path="request/:request_id/" element={<RequestPage/>}/>
						<Route path="example/:example_id/" element={<ExamplePage/>}/>
						<Route path="collection/:collection_id/">
							<Route index element={<CollectionPage/>}/>
							<Route path="documentation" element={<DocumentationPage/>}/>
						</Route>
						<Route path="folder/:folder_id/" element={<FolderPage/>}/>
						<Route path="environment/:environment_id/" element={<EnvironmentPage/>}/>
					</Route>
					<Route path="workspaces" element={<WorkspacesPage />}/>
				</Route>

				<Route path="login" element={<PublicRoute redirectPath={"/"}><LoginPage/></PublicRoute>}/>
				<Route path="register" element={<PublicRoute redirectPath={"/"}><RegisterPage/></PublicRoute>}/>

				<Route path="forbidden" element={<ForbiddenPage/>}/>
				<Route path="*" element={<NotFoundPage/>}/>
			</Routes>
		</AppContextProvider>
	);
}

export default App;
