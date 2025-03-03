import CodeEditor from "@components/app/editor/code.editor.jsx";
import {useContext} from "react";
import _ from "lodash";
import {ExampleContext} from "@contexts/example.jsx";

export default function ExampleEditorBodyFormRaw(){
	let {body, setBody} = useContext(ExampleContext);

	const handleChangeRawBody = (value) => {
		const clone = _.cloneDeep(body);
		clone.data["form_raw"] = value;
		setBody(clone);
	};

	return (
		<div className="request-editor-body-form-raw">
			<CodeEditor
				value={body.data["form_raw"]} setValue={handleChangeRawBody}
				options={{language: "json"}}
			/>
		</div>
	)
}