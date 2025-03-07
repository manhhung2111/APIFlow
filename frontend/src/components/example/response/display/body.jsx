import {useContext} from "react";
import {ExampleContext} from "@contexts/example.jsx";
import CodeEditor from "@components/app/editor/code.editor.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function ExampleResponseBody(){
	const {workspace} = useContext(WorkspaceContext);
	let {responseBody, setResponseBody} = useContext(ExampleContext);

	return (
		<div className="request-response-content request-response-body">
			<CodeEditor
				value={responseBody ?? ""}
				setValue={(value) => setResponseBody(value)}
				options={{lineNumbers: "on", language: "json", "readOnly": !workspace?.can?.editable}}
			/>
		</div>
	)
}