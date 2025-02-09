import SuperHeader from "@layout/header/header.jsx";
import MasterMenu from "@layout/menu/menu.jsx";
import {Outlet, useParams} from "react-router";
import WorkspaceContextProvider from "@contexts/workspace.jsx";

export default function WorkspacePage(){
	return (
		<WorkspaceContextProvider>
			<div className="workspace-page">
				<SuperHeader/>
				<div id="body">
					<div className="master-menu-wrapper">
						<MasterMenu/>
					</div>
					<div className="master-main-wrapper">
						<Outlet/>
					</div>
				</div>
			</div>
		</WorkspaceContextProvider>
	)
}