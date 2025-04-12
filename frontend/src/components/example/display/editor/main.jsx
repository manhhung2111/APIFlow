import {Skeleton, Tabs} from "antd";
import {useContext} from "react";
import {ExampleContext} from "@contexts/example.jsx";
import ExampleEditorParams from "@components/example/display/editor/params.jsx";
import ExampleEditorHeaders from "@components/example/display/editor/headers.jsx";
import ExampleEditorBody from "@components/example/display/editor/body/body.jsx";
import Request from "@components/request/request.jsx";

export default function ExampleEditorUrlMain(){
	const {example, params, headers, body} = useContext(ExampleContext);

	const generateItems = () => {
		let paramsLabel = <div className="request-editor-tab-label">Params</div>
		if(params.length > 1){
			paramsLabel = <div className="request-editor-tab-label">Params <span className="valid"></span></div>
		}

		let headersLabel = <div className="request-editor-tab-label">Headers</div>
		if(headers.length > 1){
			headersLabel = <div className="request-editor-tab-label">Headers <span className="valid"></span></div>
		}

		let bodyLabel = <div className="request-editor-tab-label">Body</div>
		if(body){
			if(body.type === Request.BODY_TYPES.FormData.value && body.data.form_data.length > 1){
				bodyLabel = <div className="request-editor-tab-label">Body<span className="valid"></span></div>
			} else if(body.type === Request.BODY_TYPES.FormEncoded.value && body.data.form_encoded.length > 1){
				bodyLabel = <div className="request-editor-tab-label">Body<span className="valid"></span></div>
			} else if(body.type === Request.BODY_TYPES.FormRaw.value && body.data.form_raw.length > 0){
				bodyLabel = <div className="request-editor-tab-label">Body<span className="valid"></span></div>
			}
		}

		return [
			{label: paramsLabel, key: 1, children: <ExampleEditorParams/>},
			{label: headersLabel, key: 3, children: <ExampleEditorHeaders/>},
			{label: bodyLabel, key: 4, children: <ExampleEditorBody/>},
		]
	}

	const items = [
		{label: "Params", key: 1, children: <ExampleEditorParams/>},
		{label: "Headers", key: 3, children: <ExampleEditorHeaders/>},
		{label: "Body", key: 4, children: <ExampleEditorBody/>},
	]

	return (
		<div className="request-editor-url-main">
			{example && <Tabs items={generateItems()} size={"small"} tabBarGutter={16}/>}
			{!example && <div style={{padding: 16}}><Skeleton active={true}/></div>}
		</div>
	);
}