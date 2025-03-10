import {Button, Skeleton, Tabs} from "antd";
import RequestEditorParams from "@components/request/display/editor/params.jsx";
import RequestEditorAuthorization from "@components/request/display/editor/authorization.jsx";
import RequestEditorHeaders from "@components/request/display/editor/headers.jsx";
import RequestEditorBody from "@components/request/display/editor/body/body.jsx";
import RequestEditorScripts from "@components/request/display/editor/scripts.jsx";
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";

export default function RequestEditorUrlMain() {
	const {request} = useContext(RequestContext);

	const items = [
		{label: "Params", key: 1, children: <RequestEditorParams />},
		{label: "Authorization", key: 2, children: <RequestEditorAuthorization />},
		{label: "Headers", key: 3, children: <RequestEditorHeaders />},
		{label: "Body", key: 4, children: <RequestEditorBody />},
		{label: "Scripts", key: 5, children: <RequestEditorScripts/>},
	]

	return (
		<div className="request-editor-url-main">
			{request && <Tabs items={items} size={"small"} tabBarGutter={16}/>}
			{!request && <div style={{padding: 16}}><Skeleton active={true} /></div>}
		</div>
	);
}