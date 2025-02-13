import RequestDisplayHeader from "@components/request/display/header.jsx";
import RequestEditorUrl from "@components/request/display/editor/url.jsx";
import RequestEditorUrlMain from "@components/request/display/editor/main.jsx";
import RequestResponse from "@components/request/response/display/display.jsx";
import RequestSidebar from "@components/request/sidebar/sidebar.jsx";
import './styles/request.scss';

export default function RequestPage(){

	return (
		<div className="request-page master-page">
			<div className="main-wrapper">
				<div className="request-header">
					<RequestDisplayHeader/>
				</div>
				<div className="request-main">
					<div className="rm-editor">
						<RequestEditorUrl/>
						<RequestEditorUrlMain/>
					</div>
					<div className="rm-response">
						<RequestResponse/>
					</div>
				</div>
			</div>
			<div className="request-sidebar">
				<RequestSidebar/>
			</div>
		</div>
	)
}