import _ from 'lodash';
import CodeEditor from "@components/app/editor/code.editor.jsx";
import {Tabs} from "antd";

export default function FolderDisplayScripts({folder, scripts, setScripts}){
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
		{label: "Pre-request", key: 1, children: <CodeEditor value={scripts["pre_request"]} setValue={handleSetPreScripts} />},
		{label: "Post-request", key: 2, children: <CodeEditor value={scripts["post_response"]} setValue={handleSetPostScripts} /> }
	]

	return (
		<div className="collection-display-scripts">
			<Tabs
				tabPosition="left"
				items={items}
				tabBarGutter={0}
				animated={false}
			/>
		</div>
	)
}