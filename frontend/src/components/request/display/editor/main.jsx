import {Tabs, Button} from "antd";
import RequestEditorParams from "@components/request/display/editor/params.jsx";
import RequestEditorAuthorization from "@components/request/display/editor/authorization.jsx";
import RequestEditorHeaders from "@components/request/display/editor/headers.jsx";

export default function RequestEditorUrlMain() {
	const items = [
		{label: "Params", key: 1, children: <RequestEditorParams />},
		{label: "Authorization", key: 2, children: <RequestEditorAuthorization />},
		{label: "Headers", key: 3, children: <RequestEditorHeaders />},
		{label: "Body", key: 4, children: "Body"},
		{label: "Scripts", key: 5, children: "Scripts"},
		{label: "Settings", key: 6, children: "Settings"},
	]

	const rightSide = {
		right: <Button color="#1F509A" variant="link"> Cookies </Button>
	}
	return (
		<div className="request-editor-url-main">
			<Tabs tabBarExtraContent={rightSide} items={items} size={"small"} tabBarGutter={24}/>
		</div>
	);
}