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
import PersonaPage from "@pages/persona/persona.jsx";
import ForgotPasswordPage from "@pages/authentication/forgot.password.jsx";
import ResetPasswordPage from "@pages/authentication/reset.password.jsx";
import RegisterVerificationPage from '@pages/authentication/register.verification';

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
						<Route path="persona/:persona_id/" element={<PersonaPage/>}/>
					</Route>
					<Route path="workspaces" element={<WorkspacesPage/>}/>
				</Route>

				<Route path="/reset-password"
					   element={<PublicRoute redirectPath={"/"}><ResetPasswordPage/></PublicRoute>}/>
				<Route path="/login" element={<PublicRoute redirectPath={"/"}><LoginPage/></PublicRoute>}/>
				<Route path="/register/verification" element={<PublicRoute redirectPath={"/"}><RegisterVerificationPage/></PublicRoute>}/>
				<Route path="/register" element={<PublicRoute redirectPath={"/"}><RegisterPage/></PublicRoute>}/>
				<Route path="/forgot-password"
					   element={<PublicRoute redirectPath={"/"}><ForgotPasswordPage/></PublicRoute>}/>

				<Route path="/forbidden" element={<ForbiddenPage/>}/>
				<Route path="*" element={<NotFoundPage/>}/>
			</Routes>
		</AppContextProvider>
	);
}

export default App;
