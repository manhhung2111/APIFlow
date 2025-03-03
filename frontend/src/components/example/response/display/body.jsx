import {useContext} from "react";
import {ExampleContext} from "@contexts/example.jsx";
import CodeEditor from "@components/app/editor/code.editor.jsx";

export default function ExampleResponseBody(){
	let {responseBody, setResponseBody} = useContext(ExampleContext);

	return (
		<div className="request-response-content request-response-body">
			<CodeEditor
				value={responseBody ?? ""}
				setValue={(value) => setResponseBody(value)}
				options={{lineNumbers: "on", language: "json"}}
			/>
		</div>
	)
}