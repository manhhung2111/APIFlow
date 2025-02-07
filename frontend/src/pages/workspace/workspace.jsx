import SuperHeader from "@layout/header/header.jsx";
import MasterMenu from "@layout/menu/menu.jsx";
import RequestDisplayHeader from "@components/request/display/header.jsx";
import RequestEditorUrl from "@components/request/display/editor/url.jsx";
import RequestEditorUrlMain from "@components/request/display/editor/main.jsx";
import RequestResponse from "@components/request/response/display/display.jsx";
import RequestSidebar from "@components/request/sidebar/sidebar.jsx";
import {Outlet} from "react-router";

export default function WorkspacePage() {

	return (
		<div className="workspace-page">
			<SuperHeader/>
			<div id="body">
				<div className="master-menu-wrapper">
					<MasterMenu/>
				</div>
				<div className="master-main-wrapper">
					<Outlet />
				</div>
			</div>
		</div>
	)
}