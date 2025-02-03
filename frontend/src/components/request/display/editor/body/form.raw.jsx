import CodeEditor from "@components/app/editor/index.jsx";
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import _ from "lodash";

export default function RequestEditorBodyFormRaw(){
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
				options={{language: "json"}}
			/>
		</div>
	)
}