import RequestDisplayHeader from "@components/request/display/header.jsx";
import RequestEditorUrl from "@components/request/display/editor/url.jsx";
import RequestEditorUrlMain from "@components/request/display/editor/main.jsx";
import RequestResponse from "@components/request/response/display/display.jsx";
import RequestSidebar from "@components/request/sidebar/sidebar.jsx";

export default function RequestPage() {

	return (
		<div className="request-page">
			<div className="mmw-header">

			</div>
			<div className="mmw-main">
				<div className="rm-main">
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
				<div className="sidebar">
					<RequestSidebar/>
				</div>
			</div>
		</div>
	)
}