import CodeEditor from "@components/app/editor/code.editor.jsx";
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import _ from "lodash";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function RequestEditorBodyFormRaw(){
	const {workspace} = useContext(WorkspaceContext);
	let {body, setBody} = useContext(RequestContext);

	const handleChangeRawBody = (value) => {
		const clone = _.cloneDeep(body);
		clone.data["form_raw"] = value;
		setBody(clone);
	};

	return (
		<div className="request-editor-body-form-raw">
			<CodeEditor
				value={body.data["form_raw"]} setValue={handleChangeRawBody}
				options={{language: "json", "readOnly": !workspace?.can?.editable}}
			/>
		</div>
	)
}