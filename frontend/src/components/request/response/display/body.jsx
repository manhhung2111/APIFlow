import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {Editor} from "@monaco-editor/react";
import AppPDFViewer from "@components/app/editor/pdf.jsx";

export default function RequestResponseBody(){
	let {response} = useContext(RequestContext);

	return (
		<div className="request-response-content request-response-body">
			<Editor
				height={"25vh"}
				theme={"light"}
				defaultLanguage={"json"}
				value={JSON.stringify(response.body, null, 2)}
				options={{
					"wordWrap": "on",
					"smoothScrolling": true,
					"scrollBeyondLastLine": false,
					"minimap": {"enabled": false},
					"fontSize": 12,
					"renderLineHighlight": "none",
					"readOnly": true
				}}
			/>
			{/*{response.headers["content-type"] === "application/pdf" && <AppPDFViewer data={response.body} />}*/}
		</div>
	)
}