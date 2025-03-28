import RequestResponse from "@components/request/response/display/display.jsx";
import RequestSidebar from "@components/request/sidebar/sidebar.jsx";
import ExampleDisplayHeader from "@components/example/display/header.jsx";
import ExampleContextProvider from "@contexts/example.jsx";
import ExampleEditorUrl from "@components/example/display/editor/url.jsx";
import ExampleEditorUrlMain from "@components/example/display/editor/main.jsx";
import ExampleResponse from "@components/example/response/display/display.jsx";
import ExampleSidebar from "@components/example/display/sidebar.jsx";

export default function ExamplePage(){

	return (
		<ExampleContextProvider>
			<div className="request-page master-page">
				<div className="main-wrapper">
					<div className="request-header">
						<ExampleDisplayHeader/>
					</div>
					<div className="request-main">
						<div className="rm-editor">
							<ExampleEditorUrl/>
							<ExampleEditorUrlMain/>
						</div>
						<div className="rm-response">
							<ExampleResponse/>
						</div>
					</div>
				</div>
				<div className="request-sidebar">
					<ExampleSidebar />
				</div>
			</div>
		</ExampleContextProvider>
	)

}