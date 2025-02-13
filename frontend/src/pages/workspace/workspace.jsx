import SuperHeader from "@layout/header/header.jsx";
import MasterMenu from "@layout/menu/menu.jsx";
import {Outlet} from "react-router";
import WorkspaceContextProvider from "@contexts/workspace.jsx";
import './styles/workspace.scss'

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
						<div className="mmw-header">

						</div>
						<div className="mmw-main">
							<Outlet/>
						</div>
					</div>
				</div>
			</div>
		</WorkspaceContextProvider>
	)
}