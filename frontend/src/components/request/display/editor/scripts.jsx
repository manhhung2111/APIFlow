import {Tabs} from "antd";
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import _ from "lodash";
import CodeEditor from "@components/app/editor/code.editor.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function RequestEditorScripts(){
	const {workspace} = useContext(WorkspaceContext);
	let {scripts, setScripts} = useContext(RequestContext);

	const handleSetPreScripts = (value) => {
		const clone = _.cloneDeep(scripts);
		clone["pre_request"] = value;
		setScripts(clone);
	}

	const handleSetPostScripts = (value) => {
		const clone = _.cloneDeep(scripts);
		clone["post_response"] = value;
		setScripts(clone);
	}

	const items = [
		{
			label: "Pre-request",
			key: 1,
			children: <CodeEditor value={scripts["pre_request"]} setValue={handleSetPreScripts}
								  options={{"readOnly": !workspace.can?.editable}}/>
		},
		{
			label: "Post-request",
			key: 2,
			children: <CodeEditor value={scripts["post_response"]} setValue={handleSetPostScripts}
								  options={{"readOnly": !workspace.can?.editable}}/>
		}
	]

	return (
		<div className="request-editor request-editor-scripts">
			<Tabs
				tabPosition="left"
				items={items}
				tabBarGutter={0}
				animated={false}
			/>
		</div>
	);
}