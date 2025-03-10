import {Skeleton, Tabs} from "antd";
import {useContext} from "react";
import {ExampleContext} from "@contexts/example.jsx";
import ExampleEditorParams from "@components/example/display/editor/params.jsx";
import ExampleEditorHeaders from "@components/example/display/editor/headers.jsx";
import ExampleEditorBody from "@components/example/display/editor/body/body.jsx";

export default function ExampleEditorUrlMain(){
	const {example} = useContext(ExampleContext);

	const items = [
		{label: "Params", key: 1, children: <ExampleEditorParams/>},
		{label: "Headers", key: 3, children: <ExampleEditorHeaders/>},
		{label: "Body", key: 4, children: <ExampleEditorBody/>},
	]

	return (
		<div className="request-editor-url-main">
			{example && <Tabs items={items} size={"small"} tabBarGutter={16}/>}
			{!example && <div style={{padding: 16}}><Skeleton active={true}/></div>}
		</div>
	);
}